import { prisma } from '../lib/prisma'

export interface CreateEventData {
  title: string
  description: string
  date: Date
  location: string
  organizerId: number
  maxParticipants?: number
  image?: string
}

export interface UpdateEventData {
  title?: string
  description?: string
  date?: Date
  location?: string
  maxParticipants?: number
  currentParticipants?: number
  image?: string
  isActive?: boolean
}

export interface EventFilters {
  search?: string
  organizerId?: number
  isActive?: boolean
  page?: number
  limit?: number
}

export class EventService {
  async createEvent(data: CreateEventData) {
    return prisma.event.create({
      data,
      include: {
        organizer: {
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

  async findEventById(id: number) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
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

  async updateEvent(id: number, data: UpdateEventData) {
    return prisma.event.update({
      where: { id },
      data,
      include: {
        organizer: {
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

  async deleteEvent(id: number): Promise<void> {
    await prisma.event.delete({
      where: { id }
    })
  }

  async getEvents(filters: EventFilters = {}) {
    const { search, organizerId, isActive, page = 1, limit = 10 } = filters
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (organizerId) {
      where.organizerId = organizerId
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'asc' },
        include: {
          organizer: {
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
      prisma.event.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return {
      events,
      pagination: {
        currentPage: page,
        totalPages,
        totalEvents: total,
        hasNextPage,
        hasPrevPage,
        limit
      }
    }
  }
}

export const eventService = new EventService() 