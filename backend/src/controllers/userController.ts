import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { uploadToSupabase, deleteFromSupabase } from '../middleware/upload';

// Define UserRole enum locally to match Prisma schema
enum UserRole {
  MEMBER = 'member',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

// Extend Request to include user
interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all users with pagination and search (admin/manager only)
// @access  Private
// @query   page: number (default: 1) - Page number for pagination
// @query   limit: number (default: 10) - Number of users per page
// @query   search: string (optional) - Search in firstName, lastName, email, phone
// @query   role: string (optional) - Filter by user role
// @query   isActive: string (optional) - Filter by active status ('true' or 'false')

// @desc    Get current user
// @access  Private
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const role = req.query.role as string || '';

    const result = await userService.getUsers({
      search,
      role: role as any,
      page,
      limit
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user by ID
// @access  Private
export const getUserById = async (req: Request, res: Response) => {
  console.log('getUserById', req.params.id)
  try {
    const user = await userService.findUserById(parseInt(req.params.id));
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Register a new user
// @access  Public
export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phone, address, city, state, pincode, dob, gender, occupationField, occupation, role } = req.body;
    if (email) {
      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
    }

    // Handle image upload
    let profileImagePath = null;
    if (req.file) {
      try {
        // Upload new image to profiles bucket
        const uploadedFile = await uploadToSupabase(req.file, 'profiles');
        profileImagePath = uploadedFile.url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image'
        });
      }
    }

    // Build create object
    const createFields: any = {};
    if (firstName !== undefined) createFields.firstName = firstName;
    if (lastName !== undefined) createFields.lastName = lastName;
    if (email !== undefined) createFields.email = email;
    if (password !== undefined) createFields.password = password;
    if (phone !== undefined) createFields.phone = phone;
    if (address !== undefined) createFields.address = address;
    if (city !== undefined) createFields.city = city;
    if (state !== undefined) createFields.state = state;
    if (pincode !== undefined) createFields.pincode = pincode;
    if (dob !== undefined) createFields.dob = dob ? new Date(dob) : null;
    if (gender !== undefined) createFields.gender = gender;
    if (occupationField !== undefined) createFields.occupationField = occupationField || null;
    if (occupation !== undefined) createFields.occupation = occupation || null;
    if (profileImagePath) {
      createFields.profileImagePath = profileImagePath;
    }
    if (role !== undefined) createFields.role = role;

    // Create new user
    const createdUser = await userService.createUser(createFields);

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: createdUser
    });
  } catch (error) {
    console.error('User create error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during user create'
    });
  }
};

// @desc    Search users by firstName, lastName, email, or phone
// @access  Private
export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { searchText } = req.body;
    
    if (!searchText || searchText.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search text is required'
      });
    }

    const result = await userService.searchUsers(searchText.trim());

    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Search users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during user search'
    });
  }
};

// @desc    Update user by ID (admin only)
// @access  Private
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password, phone, address, city, state, pincode, dob, gender, occupationField, occupation, role } = req.body;
    
    // Check if user exists
    const existingUser = await userService.findUserById(parseInt(id));
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being updated and if it's already taken
    if (email && email !== existingUser.email) {
      const emailExists = await userService.findUserByEmail(email);
      if (emailExists && emailExists.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Handle image upload
    let profileImagePath = existingUser.profileImagePath;
    if (req.file) {
      try {
        // Delete old profile image if exists
        if (existingUser.profileImagePath) {
          const oldFilename = existingUser.profileImagePath.split('/').pop();
          if (oldFilename) {
            await deleteFromSupabase(oldFilename, 'profiles');
          }
        }
        // Upload new image to profiles bucket
        const uploadedFile = await uploadToSupabase(req.file, 'profiles');
        profileImagePath = uploadedFile.url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image'
        });
      }
    }

    // Build update object
    const updateFields: any = {};
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (email !== undefined) updateFields.email = email;
    if (password !== undefined) updateFields.password = password;
    if (phone !== undefined) updateFields.phone = phone;
    if (address !== undefined) updateFields.address = address;
    if (city !== undefined) updateFields.city = city;
    if (state !== undefined) updateFields.state = state;
    if (pincode !== undefined) updateFields.pincode = pincode;
    if (dob !== undefined) updateFields.dob = dob ? new Date(dob) : null;
    if (gender !== undefined) updateFields.gender = gender;
    if (occupationField !== undefined) updateFields.occupationField = occupationField || null;
    if (occupation !== undefined) updateFields.occupation = occupation || null;
    if (role !== undefined) updateFields.role = role;
    if (profileImagePath !== existingUser.profileImagePath) {
      updateFields.profileImagePath = profileImagePath;
    }

    // Update user
    const updatedUser = await userService.updateUser(parseInt(id), updateFields);

    return res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during user update'
    });
  }
};

// @desc    Delete user by ID (admin only)
// @access  Private
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await userService.findUserById(parseInt(id));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (req.user && req.user.id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Delete user
    await userService.deleteUser(parseInt(id));

    return res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during user deletion'
    });
  }
};

// @desc    Update user profile with image
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, password, phone, address, city, state, pincode, dob, gender, occupationField, occupation } = req.body;
    const userId = parseInt(req.user?.id);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Check if user exists
    const existingUser = await userService.findUserById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Handle image upload
    let profileImagePath = existingUser.profileImagePath;
    if (req.file) {
      try {
        // Delete old profile image if exists
        if (existingUser.profileImagePath) {
          const oldFilename = existingUser.profileImagePath.split('/').pop();
          if (oldFilename) {
            await deleteFromSupabase(oldFilename, 'profiles');
          }
        }
        // Upload new image to profiles bucket
        const uploadedFile = await uploadToSupabase(req.file, 'profiles');
        profileImagePath = uploadedFile.url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image'
        });
      }
    }
    // Build update object
    const updateFields: any = {};
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (password !== undefined) updateFields.password = password;
    if (phone !== undefined) updateFields.phone = phone;
    if (address !== undefined) updateFields.address = address;
    if (city !== undefined) updateFields.city = city;
    if (state !== undefined) updateFields.state = state;
    if (pincode !== undefined) updateFields.pincode = pincode;
    if (dob !== undefined) updateFields.dob = dob ? new Date(dob) : null;
    if (gender !== undefined) updateFields.gender = gender;
    if (occupationField !== undefined) updateFields.occupationField = occupationField || null;
    if (occupation !== undefined) updateFields.occupation = occupation || null;
    if (profileImagePath !== existingUser.profileImagePath) {
      updateFields.profileImagePath = profileImagePath;
    }
    // Update user profile
    const updatedUser = await userService.updateProfile(userId, updateFields);

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile with image error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
};