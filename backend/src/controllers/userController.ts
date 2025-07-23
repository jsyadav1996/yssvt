import { Request, Response } from 'express';
import { User } from '../models/User';
import { AuthRequest, UserRole } from '../types';

// @desc    Get all users (admin/manager only)
// @access  Private
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: { users }
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
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    const updateFields: any = {};
    
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 

// @desc    Register a new user
// @access  Public
export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phone, address, role } = req.body;
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
    }
    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      role: role || UserRole.MEMBER
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address
        }
      }
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

    const searchRegex = new RegExp(searchText.trim(), 'i'); // Case-insensitive search
    
    const users = await User.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ]
    }).select('-password').sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: { 
        users,
        total: users.length,
        searchText: searchText.trim()
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during user search'
    });
  }
};