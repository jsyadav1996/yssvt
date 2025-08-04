import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { prisma } from '../lib/prisma';

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
    const isActive = req.query.isActive as string || '';

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery: any = {};
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      searchQuery.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ];
    }

    if (role) {
      searchQuery.role = role;
    }

    if (isActive !== '') {
      searchQuery.isActive = isActive === 'true';
    }

    // Get total count for pagination
    const totalUsers = await prisma.user.count({ where: searchQuery });
    
    // Get users with pagination and search
    const users = await prisma.user.findMany({
      where: searchQuery,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalUsers / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: { 
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNextPage,
          hasPrevPage,
          limit
        },
        filters: {
          search,
          role,
          isActive
        }
      }
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
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
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

    const user = await prisma.user.update({
      where: { id: parseInt(req.user?.id) },
      data: updateFields,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
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
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
    }
    // Create new user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        role: role || UserRole.MEMBER
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: user.id,
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
    
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: searchText.trim(), mode: 'insensitive' } },
          { lastName: { contains: searchText.trim(), mode: 'insensitive' } },
          { email: { contains: searchText.trim(), mode: 'insensitive' } },
          { phone: { contains: searchText.trim(), mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

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

// @desc    Update user by ID (admin only)
// @access  Private
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, address, role } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being updated and if it's already taken
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findFirst({ 
        where: { 
          email, 
          id: { not: parseInt(id) } 
        } 
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }
    console.log('email', email)
    // Build update object
    const updateFields: any = {};
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (address !== undefined) updateFields.address = address;
    if (role !== undefined) updateFields.role = role;

    console.log('updateFields', updateFields)
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateFields,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true
      }
    });

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
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
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
    await prisma.user.delete({ where: { id: parseInt(id) } });

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