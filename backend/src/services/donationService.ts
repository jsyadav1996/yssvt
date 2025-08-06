import { prisma } from '../lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'

export interface CreateDonationData {
  donorId?: number
  amount: number
  purpose?: string
  paymentMethod: 'online' | 'cash'
  date?: Date
  location?: string
  bankName?: string
}

export interface UpdateDonationData {
  amount?: number
  purpose?: string
  paymentMethod?: 'online' | 'cash'
  donorId?: number
  date?: Date
  location?: string
  bankName?: string
}

export interface DonationFilters {
  donorId?: number
  page?: number
  limit?: number
}

export class DonationService {
  async createDonation(data: CreateDonationData) {
    const createData: any = {
      amount: new Decimal(data.amount),
      purpose: data.purpose,
      paymentMethod: data.paymentMethod,
      ...(data.donorId && { donorId: data.donorId }),
      ...(data.date && { date: data.date }),
      ...(data.location && { location: data.location }),
      ...(data.bankName && { bankName: data.bankName })
    }

    return prisma.donation.create({
      data: createData,
      include: {
        donor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        }
      }
    })
  }

  async findDonationById(id: number) {
    return prisma.donation.findUnique({
      where: { id },
      include: {
        donor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        }
      }
    })
  }

  async updateDonation(id: number, data: UpdateDonationData) {
    const updateData: any = {}
    
    if (data.amount !== undefined) {
      updateData.amount = new Decimal(data.amount)
    }
    if (data.purpose !== undefined) {
      updateData.purpose = data.purpose
    }
    if (data.paymentMethod !== undefined) {
      updateData.paymentMethod = data.paymentMethod
    }
    if (data.donorId !== undefined) {
      updateData.donorId = data.donorId
    }
    if (data.date !== undefined) {
      updateData.date = data.date
    }
    if (data.location !== undefined) {
      updateData.location = data.location
    }
    if (data.bankName !== undefined) {
      updateData.bankName = data.bankName
    }

    return prisma.donation.update({
      where: { id },
      data: updateData,
      include: {
        donor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        }
      }
    })
  }

  async deleteDonation(id: number): Promise<void> {
    await prisma.donation.delete({
      where: { id }
    })
  }

  async getDonations(filters: DonationFilters = {}) {
    const { donorId, page = 1, limit = 10 } = filters
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (donorId) {
      where.donorId = donorId
    }
    


    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          donor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true
            }
          }
        }
      }),
      prisma.donation.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return {
      donations,
      pagination: {
        currentPage: page,
        totalPages,
        totalDonations: total,
        hasNextPage,
        hasPrevPage,
        limit
      }
    }
  }

  async getUserDonations(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where: { donorId: userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          donor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true
            }
          }
        }
      }),
      prisma.donation.count({ where: { donorId: userId } })
    ])

    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return {
      donations,
      pagination: {
        currentPage: page,
        totalPages,
        totalDonations: total,
        hasNextPage,
        hasPrevPage,
        limit
      }
    }
  }

  async getTotalDonationAmount() {
    const result = await prisma.donation.aggregate({
      _sum: {
        amount: true
      }
    })
    return result._sum.amount || new Decimal(0)
  }
}

export const donationService = new DonationService() 