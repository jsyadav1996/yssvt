import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { deleteFromSupabase, uploadToSupabase } from '../middleware/upload';

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

    // Media paths are already full URLs from Supabase
    const eventsWithFullUrls = events;

    const total = await prisma.event.count({ where: filter });

    res.json({
      success: true,
      data: {
        events: eventsWithFullUrls,
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

    // Media paths are already full URLs from Supabase
    return res.json({
      success: true,
      data: event
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
      const uploadPromises = req.files.map(async (file: Express.Multer.File) => {
        const uploadedFile = await uploadToSupabase(file);
        return {
          eventId: event.id,
          path: uploadedFile.url
        };
      });

      const eventMediaData = await Promise.all(uploadPromises);
      
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

    // Media paths are already full URLs from Supabase
    const eventWithFullUrls = {
      ...eventWithMedia,
      event_media: eventWithMedia?.event_media || []
    };

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event: eventWithFullUrls }
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
    const { title, description, date, location } = req.body;
    
    // Handle image upload
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const event = await prisma.event.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        description,
        date: new Date(date),
        location
      }
    });

    // Handle multiple images upload
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file: Express.Multer.File) => {
        const uploadedFile = await uploadToSupabase(file);
        return {
          eventId: parseInt(req.params.id),
          path: uploadedFile.url
        };
      });

      const eventMediaData = await Promise.all(uploadPromises);
      
      await prisma.eventMedia.createMany({
        data: eventMediaData
      });
    }

    // Fetch the updated event with media
    const eventWithMedia = await prisma.event.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        event_media: true
      }
    });

    // Media paths are already full URLs from Supabase
    const eventWithFullUrls = {
      ...eventWithMedia,
      event_media: eventWithMedia?.event_media || []
    };

    return res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event: eventWithFullUrls }
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
    // First, get the event with its media to delete files from storage
    const eventWithMedia = await prisma.event.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        event_media: true
      }
    });

    if (!eventWithMedia) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Delete files from Supabase storage
    if (eventWithMedia.event_media.length > 0) {
      const deletePromises = eventWithMedia.event_media.map(async (media) => {
        try {
          // Extract filename from Supabase URL
          const url = media.path;
          if (url) {
            // Extract filename from Supabase URL (last part after the last slash)
            const filename = url.split('/').pop();
            if (filename) {
              await deleteFromSupabase(filename);
            }
          }
        } catch (error) {
          console.error(`Error deleting file ${media.path}:`, error);
          // Continue with other files even if one fails
        }
      });

      await Promise.all(deletePromises);
    }

    // Delete the event (this will cascade delete event_media records)
    await prisma.event.delete({
      where: { id: parseInt(req.params.id) }
    });

    return res.json({
      success: true,
      message: 'Event and associated media deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 

// @desc    Delete individual event media (manager/admin only)
// @access  Private
export const deleteEventMedia = async (req: Request, res: Response) => {
  try {
    const mediaId = parseInt(req.params.mediaId);
    
    // Get the media record to get the file path
    const media = await prisma.eventMedia.findUnique({
      where: { id: mediaId }
    });

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Event media not found'
      });
    }

    // Delete file from Supabase storage
    try {
      const url = media.path;
      if (url) {
        // Extract filename from Supabase URL (last part after the last slash)
        const filename = url.split('/').pop();
        if (filename) {
          await deleteFromSupabase(filename);
        }
      }
    } catch (error) {
      console.error(`Error deleting file ${media.path}:`, error);
      // Continue with database deletion even if file deletion fails
    }

    // Delete the media record from database
    await prisma.eventMedia.delete({
      where: { id: mediaId }
    });

    return res.json({
      success: true,
      message: 'Event media deleted successfully'
    });
  } catch (error) {
    console.error('Delete event media error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 