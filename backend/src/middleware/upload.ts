import multer from 'multer';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to upload file to Supabase
export const uploadToSupabase = async (file: Express.Multer.File) => {
  try {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('yssvt')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600'
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('yssvt')
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

// Helper function to delete file from Supabase storage
export const deleteFromSupabase = async (filename: string) => {
  try {
    const { error } = await supabase.storage
      .from('yssvt')
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