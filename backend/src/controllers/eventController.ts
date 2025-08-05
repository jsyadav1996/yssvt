import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Extend Request to include user
interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all events
// @access  Public
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, active } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const filter: any = {};
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }

    const events = await prisma.event.findMany({
      where: filter,
      include: {
        event_media: true
      },
      orderBy: { date: 'asc' },
      skip,
      take: Number(limit)
    });

    const total = await prisma.event.count({ where: filter });

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalEvents: total,
          hasNext: skip + events.length < total,
          hasPrev: Number(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get event by ID
// @access  Public
export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        event_media: true
      }
    });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    return res.json({
      success: true,
      data: { event }
    });
  } catch (error) {
    console.error('Get event error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new event (manager/admin only)
// @access  Private
export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    console.log('req.body', req.body)
    const { title, description, date, location } = req.body;
    
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location
      }
    });

    // Handle multiple images upload
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const eventMediaData = req.files.map((file: any) => ({
        eventId: event.id,
        path: `/uploads/${file.filename}`
      }));

      await prisma.eventMedia.createMany({
        data: eventMediaData
      });
    }

    // Fetch the created event with media
    const eventWithMedia = await prisma.event.findUnique({
      where: { id: event.id },
      include: {
        event_media: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event: eventWithMedia }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update event (manager/admin only)
// @access  Private
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    return res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event }
    });
  } catch (error) {
    console.error('Update event error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete event (manager/admin only)
// @access  Private
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.delete({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    return res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 