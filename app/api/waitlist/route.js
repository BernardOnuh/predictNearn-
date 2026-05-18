// app/api/waitlist/route.js - Waitlist API Routes

import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

// POST /api/waitlist - Join the waitlist
export async function POST(request) {
  try {
    await connectDB();
    const { email, refCode } = await request.json();

    // Validation
    if (!email) {
      return Response.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = new User({
      email,
    });

    // If referred by someone
    if (refCode) {
      const referrer = await User.findOne({ refCode });
      if (referrer) {
        newUser.referredBy = refCode;
        // Increment referrer's referral count
        await User.findByIdAndUpdate(referrer._id, {
          $inc: { referralCount: 1 },
        });
      }
    }

    await newUser.save();

    // Get waitlist position
    const position = await User.countDocuments({ 
      createdAt: { $lte: newUser.createdAt } 
    });

    return Response.json(
      {
        success: true,
        message: 'Successfully joined waitlist!',
        data: {
          email: newUser.email,
          refCode: newUser.refCode,
          position: position,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Waitlist signup error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// GET /api/waitlist?action=stats - Get waitlist statistics
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const email = searchParams.get('email');

    if (action === 'stats') {
      const totalSignups = await User.countDocuments();
      const activeUsers = await User.countDocuments({ status: 'active' });
      const totalReferrals = await User.aggregate([
        { $group: { _id: null, total: { $sum: '$referralCount' } } },
      ]);

      return Response.json({
        success: true,
        data: {
          totalSignups,
          activeUsers,
          totalReferrals: totalReferrals[0]?.total || 0,
        },
      });
    }

    if (action === 'position' && email) {
      const user = await User.findOne({ email });

      if (!user) {
        return Response.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      const position = await User.countDocuments({ 
        createdAt: { $lte: user.createdAt } 
      });

      return Response.json({
        success: true,
        data: {
          email: user.email,
          position: position,
          referralCount: user.referralCount,
          refCode: user.refCode,
        },
      });
    }

    if (action === 'leaderboard') {
      const topReferrers = await User.find()
        .sort({ referralCount: -1 })
        .limit(10)
        .select('email referralCount position createdAt');

      return Response.json({
        success: true,
        data: topReferrers,
      });
    }

    return Response.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Waitlist fetch error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}