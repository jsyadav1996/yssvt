import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

// Define types locally
type UserRole = 'member' | 'manager' | 'admin' | 'system_admin'

type User = {
  id: number
  firstName: string
  lastName: string
  email: string | null
  password?: string | null
  role: UserRole | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  dob: Date | null
  gender: string | null
  profileImagePath: string | null
  occupationField: string | null
  occupation: string | null
  createdAt: Date
  updatedAt: Date | null
}

export interface CreateUserData {
  firstName: string
  lastName: string
  email: string
  password?: string
  role?: UserRole
  phone?: string
  dob?: Date | null
  gender?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  occupationField?: string
  occupation?: string
}

export interface RegisterUserData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  address?: string
}

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  role?: UserRole
  phone?: string
  dob?: Date | null
  gender?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  occupationField?: string
  occupation?: string
}

export interface UserFilters {
  search?: string
  role?: UserRole
  page?: number
  limit?: number
}

const userSelectWithoutPassword = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  phone: true,
  dob: true,
  gender: true,
  address: true,
  city: true,
  state: true,
  pincode: true,
  profileImagePath: true,
  occupationField: true,
  occupation: true,
  createdAt: true,
  updatedAt: true
};



export class UserService {
  async createUser(data: CreateUserData): Promise<Omit<User, 'password'>> {
    console.log('data', data)
    
    // Handle empty email string - convert to null
    const email = data.email && data.email.trim() !== '' ? data.email.trim() : null;
    
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12)
    }
    
    const user = await prisma.user.create({
      data: {
        ...data,
        email
      } as any,
      select: userSelectWithoutPassword
    })
    
    return user
  }

  async register(data: RegisterUserData): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(data.password, 12)
    
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        role: 'member' // Default role for registration
      },
      select: userSelectWithoutPassword
    })
    
    return user
  }

  async findUserById(id: number): Promise<Omit<User, 'password'> | null> {
    return prisma.user.findUnique({
      where: { id },
      select: userSelectWithoutPassword
    })
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { ...userSelectWithoutPassword, password: true }
    })
    return user
  }

  async updateUser(id: number, data: UpdateUserData): Promise<Omit<User, 'password'>> {
    // Handle empty email string - convert to null
    const email = data.email && data.email.trim() !== '' ? data.email.trim() : null;
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12)
    }
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        email
      } as any,
      select: userSelectWithoutPassword
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
      // Split search text into words for cross-column search
      const searchWords = search.trim().split(/\s+/).filter(word => word.length > 0)
      
      where.OR = [
        // Search in individual fields
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        // Cross-column search: search words can be in either firstName or lastName
        ...(searchWords.length > 1 ? [{
          AND: searchWords.map(word => ({
            OR: [
              { firstName: { contains: word, mode: 'insensitive' } },
              { lastName: { contains: word, mode: 'insensitive' } }
            ]
          }))
        }] : [])
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
          city: true,
          state: true,
          pincode: true,
          profileImagePath: true,
          occupationField: true,
          occupation: true,
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

  async comparePassword(user: User, candidatePassword: string): Promise<boolean> {    
    if (!user || !user.password) return false
    
    return bcrypt.compare(candidatePassword, user.password)
  }

  async searchUsers(searchText: string) {
    const where: any = {}
    
    if (searchText.trim()) {
      // Split search text into words for cross-column search
      const searchWords = searchText.trim().split(/\s+/).filter(word => word.length > 0)
      
      where.OR = [
        // Search in individual fields
        { firstName: { contains: searchText, mode: 'insensitive' } },
        { lastName: { contains: searchText, mode: 'insensitive' } },
        { email: { contains: searchText, mode: 'insensitive' } },
        { phone: { contains: searchText, mode: 'insensitive' } },
        // Cross-column search: search words can be in either firstName or lastName
        ...(searchWords.length > 1 ? [{
          AND: searchWords.map(word => ({
            OR: [
              { firstName: { contains: word, mode: 'insensitive' } },
              { lastName: { contains: word, mode: 'insensitive' } }
            ]
          }))
        }] : [])
      ]
    }
    
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        profileImagePath: true,
        occupationField: true,
        occupation: true,
        createdAt: true,
        updatedAt: true
      },
      take: 10
    })

    return {
      users,
      total: users.length,
      searchText
    }
  }

  async updateProfile(userId: number, data: UpdateUserData): Promise<Omit<User, 'password'>> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12)
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: data as any,
      select: userSelectWithoutPassword
    })
    
    return user
  }
}

export const userService = new UserService() 