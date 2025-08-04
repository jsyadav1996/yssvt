import { prisma } from '../lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'

export interface CreateDonationData {
  donorId: number
  amount: number
  purpose?: string
  anonymous: boolean
  paymentMethod: 'online' | 'cash'
  transactionId?: string
}

export interface UpdateDonationData {
  amount?: number
  purpose?: string
  anonymous?: boolean
  paymentMethod?: 'online' | 'cash'
  status?: 'pending' | 'completed' | 'failed'
  transactionId?: string
}

export interface DonationFilters {
  donorId?: number
  status?: 'pending' | 'completed' | 'failed'
  page?: number
  limit?: number
}

export class DonationService {
  async createDonation(data: CreateDonationData) {
    return prisma.donation.create({
      data: {
        ...data,
        amount: new Decimal(data.amount)
      },
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
    const updateData: any = { ...data }
    if (data.amount !== undefined) {
      updateData.amount = new Decimal(data.amount)
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
    const { donorId, status, page = 1, limit = 10 } = filters
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (donorId) {
      where.donorId = donorId
    }
    
    if (status) {
      where.status = status
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

  async getUserDonations(userId: number) {
    return prisma.donation.findMany({
      where: { donorId: userId },
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
    })
  }

  async updateDonationStatus(id: number, status: 'pending' | 'completed' | 'failed', transactionId?: string) {
    return prisma.donation.update({
      where: { id },
      data: { status, transactionId },
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
}

export const donationService = new DonationService() 