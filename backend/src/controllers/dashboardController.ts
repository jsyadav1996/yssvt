import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// @desc    Get dashboard statistics and recent activities
// @access  Private (admin/manager only)
// @returns Dashboard data with counts and recent activities
export const getDashboardData = async (req: Request, res: Response) => {
  try {
    // Get total counts
    const [totalEvents, totalDonations, totalMembers] = await Promise.all([
      prisma.event.count(),
      prisma.donation.count(),
      prisma.user.count()
    ]);

    // Get total donation amount
    const donationAmountResult = await prisma.donation.aggregate({
      _sum: {
        amount: true
      }
    });
    const totalDonationAmount = donationAmountResult._sum.amount || 0;

    // Get recent activities (last 10 activities)
    const recentActivities = await prisma.$transaction([
      // Recent events (last 5)
      prisma.event.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          date: true,
          createdAt: true
        }
      }),
      // Recent donations (last 5)
      prisma.donation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          amount: true,
          purpose: true,
          createdAt: true
        }
      }),
      // Recent user registrations (last 5)
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          createdAt: true
        }
      })
    ]);

    // Combine and sort recent activities by creation date
    const allActivities = [
      ...recentActivities[0].map(event => ({
        ...event,
        activityType: 'event',
        description: `New event: ${event.title}`,
        date: event.createdAt
      })),
      ...recentActivities[1].map(donation => ({
        ...donation,
        activityType: 'donation',
        description: `New donation: ₹${donation.amount} for ${donation.purpose}`,
        date: donation.createdAt
      })),
      ...recentActivities[2].map(user => ({
        ...user,
        activityType: 'user',
        description: `New member: ${user.firstName} ${user.lastName}`,
        date: user.createdAt
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10); // Get top 10 most recent
    
    res.json({
      success: true,
      data: {
        overview: {
          totalEvents,
          totalDonations,
          totalMembers,
          totalDonationAmount: Number(totalDonationAmount)
        },
        recentActivities: allActivities
      }
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 