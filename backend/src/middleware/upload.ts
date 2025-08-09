import multer from 'multer';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to compress image to under 500KB
const compressImage = async (buffer: Buffer, mimetype: string): Promise<Buffer> => {
  const targetSizeKB = 200;
  const targetSizeBytes = targetSizeKB * 1024;
  
  // Start with a reasonable quality and size
  let quality = 85;
  let width = 1920; // Max width
  let compressed: Buffer;
  
  // First attempt with initial settings
  compressed = await sharp(buffer)
    .resize(width, null, { 
      withoutEnlargement: true,
      fit: 'inside'
    })
    .jpeg({ quality })
    .toBuffer();
  
  // If still too large, reduce quality and/or size iteratively
  while (compressed.length > targetSizeBytes && quality > 20) {
    if (compressed.length > targetSizeBytes * 2) {
      // If much larger, reduce width first
      width = Math.floor(width * 0.8);
    }
    
    // Reduce quality
    quality -= 10;
    
    compressed = await sharp(buffer)
      .resize(width, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: Math.max(quality, 20) })
      .toBuffer();
  }
  
  // If still too large, do final aggressive compression
  if (compressed.length > targetSizeBytes) {
    compressed = await sharp(buffer)
      .resize(800, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 20 })
      .toBuffer();
  }
  
  return compressed;
};

// Helper function to upload file to Supabase (for event media)
export const uploadToSupabase = async (file: Express.Multer.File, bucket: string = 'events') => {
  try {
    let fileBuffer = file.buffer;
    let originalMimetype = file.mimetype;
    const targetSizeBytes = 200 * 1024; // 500KB
    
    // Compress image only if it's an image file AND larger than 500KB
    if (file.mimetype.startsWith('image/') && file.size > targetSizeBytes) {
      fileBuffer = await compressImage(file.buffer, file.mimetype);
      // Convert to JPEG for consistency after compression
      originalMimetype = 'image/jpeg';
    }
    
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.mimetype.startsWith('image/') ? '.jpg' : path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + fileExtension;
    
    // Upload to Supabase storage (events bucket for events)
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, fileBuffer, {
        contentType: originalMimetype,
        cacheControl: '3600'
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    return {
      filename: filename,
      originalname: file.originalname,
      mimetype: originalMimetype,
      size: fileBuffer.length, // Return compressed size
      url: urlData.publicUrl
    };
  } catch (error) {
    throw error;
  }
};

// Helper function to delete file from Supabase storage (for event media)
export const deleteFromSupabase = async (filename: string, bucket: string = 'events') => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filename]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting file from Supabase:', error);
    throw error;
  }
};

// File filter for images only
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Configure multer with memory storage
export const uploadImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit (before compression)
  }
});

// Single file upload middleware
export const uploadSingleImage = uploadImage.single('image');

// Multiple files upload middleware
export const uploadMultipleImages = uploadImage.array('images', 20); // Max 20 images 