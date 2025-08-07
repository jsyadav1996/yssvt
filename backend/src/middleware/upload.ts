import multer from 'multer';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to upload file to Supabase (for event media)
export const uploadToSupabase = async (file: Express.Multer.File, bucket: string = 'yssvt') => {
  try {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    
    // Upload to Supabase storage (yssvt bucket for events)
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
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
      mimetype: file.mimetype,
      size: file.size,
      url: urlData.publicUrl
    };
  } catch (error) {
    throw error;
  }
};

// Helper function to delete file from Supabase storage (for event media)
export const deleteFromSupabase = async (filename: string, bucket: string = 'yssvt') => {
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
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Single file upload middleware
export const uploadSingleImage = uploadImage.single('image');

// Multiple files upload middleware
export const uploadMultipleImages = uploadImage.array('images', 20); // Max 20 images 