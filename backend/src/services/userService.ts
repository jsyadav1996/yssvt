import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

// Define types locally
type UserRole = 'member' | 'manager' | 'admin'

type User = {
  id: number
  firstName: string
  lastName: string
  email: string | null
  password: string | null
  role: UserRole | null
  phone: string | null
  address: string | null
  createdAt: Date
  updatedAt: Date | null
}

export interface CreateUserData {
  firstName: string
  lastName: string
  email: string
  password: string
  role?: UserRole
  phone?: string
  address?: string
}

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
}

export interface UserFilters {
  search?: string
  role?: UserRole
  page?: number
  limit?: number
}

export class UserService {
  async createUser(data: CreateUserData): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(data.password, 12)
    
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
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
    })
    
    return user
  }

  async findUserById(id: number): Promise<Omit<User, 'password'> | null> {
    return prisma.user.findUnique({
      where: { id },
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
    })
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    })
  }

  async updateUser(id: number, data: UpdateUserData): Promise<Omit<User, 'password'>> {
    const user = await prisma.user.update({
      where: { id },
      data,
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
    })
    
    return user
  }

  async deleteUser(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id }
    })
  }

  async getUsers(filters: UserFilters = {}) {
    const { search, role, page = 1, limit = 10 } = filters
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (role) {
      where.role = role
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
      }),
      prisma.user.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers: total,
        hasNextPage,
        hasPrevPage,
        limit
      },
      filters: {
        search: search || '',
        role: role || ''
      }
    }
  }

  async comparePassword(userId: number, candidatePassword: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    })
    
    if (!user || !user.password) return false
    
    return bcrypt.compare(candidatePassword, user.password)
  }
}

export const userService = new UserService() 