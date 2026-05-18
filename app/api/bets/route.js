// app/api/bets/route.js - Bets API Routes

import { connectDB } from '@/lib/mongodb';
import Bet from '@/models/Bet';
import User from '@/models/User';
import Event from '@/models/Event';

// POST /api/bets - Place a new bet
export async function POST(request) {
  try {
    await connectDB();
    const { email, walletAddress, eventId, oddIndex, amount } = await request.json();

    // Validation
    if (!email || !walletAddress || !eventId || oddIndex === undefined || !amount) {
      return Response.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (amount < 0.01) {
      return Response.json(
        { success: false, message: 'Minimum bet is 0.01 cUSD' },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        { success: false, message: 'User not found. Join waitlist first.' },
        { status: 404 }
      );
    }

    // Get event
    const event = await Event.findById(eventId);
    if (!event) {
      return Response.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    // Check event is active
    if (event.status === 'closed' || event.status === 'settled') {
      return Response.json(
        { success: false, message: 'Betting closed for this event' },
        { status: 400 }
      );
    }

    // Validate odd index
    if (oddIndex < 0 || oddIndex > 2) {
      return Response.json(
        { success: false, message: 'Invalid odd selection' },
        { status: 400 }
      );
    }

    const selectedOdd = event.odds[oddIndex];
    const potentialWin = amount * selectedOdd;

    // Create bet
    const newBet = new Bet({
      userId: user._id,
      eventId: event._id,
      email,
      walletAddress: walletAddress.toLowerCase(),
      eventTitle: event.title,
      selectedOdd,
      oddIndex,
      amount,
      potentialWin,
    });

    await newBet.save();

    // Update user stats
    await User.findByIdAndUpdate(user._id, {
      $inc: { totalBetsPlaced: 1 },
    });

    // Update event stats
    await Event.findByIdAndUpdate(eventId, {
      $inc: { betCount: 1, totalBetAmount: amount },
    });

    return Response.json(
      {
        success: true,
        message: 'Bet placed successfully!',
        data: {
          betId: newBet._id,
          eventTitle: newBet.eventTitle,
          selectedOdd: newBet.selectedOdd,
          amount: newBet.amount,
          potentialWin: newBet.potentialWin,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Bet placement error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// GET /api/bets - Get bets with filtering
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const action = searchParams.get('action');
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = parseInt(searchParams.get('skip')) || 0;

    if (action === 'stats' && email) {
      const bets = await Bet.find({ email });

      const stats = {
        totalBets: bets.length,
        totalWins: bets.filter((b) => b.status === 'won').length,
        totalLosses: bets.filter((b) => b.status === 'lost').length,
        pending: bets.filter((b) => b.status === 'pending').length,
        totalStaked: bets.reduce((sum, b) => sum + b.amount, 0),
        totalWinnings: bets.reduce((sum, b) => sum + (b.winnings || 0), 0),
        winRate: bets.length > 0 
          ? (bets.filter((b) => b.status === 'won').length / bets.length * 100).toFixed(2) 
          : 0,
      };

      return Response.json({
        success: true,
        data: stats,
      });
    }

    if (action === 'leaderboard') {
      const topWinners = await Bet.aggregate([
        { $match: { status: 'won' } },
        {
          $group: {
            _id: '$email',
            totalWinnings: { $sum: '$winnings' },
            betCount: { $sum: 1 },
          },
        },
        { $sort: { totalWinnings: -1 } },
        { $limit: 10 },
      ]);

      return Response.json({
        success: true,
        data: topWinners,
      });
    }

    if (email) {
      let query = { email };
      if (status) {
        query.status = status;
      }

      const bets = await Bet.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const total = await Bet.countDocuments(query);

      return Response.json({
        success: true,
        data: bets,
        pagination: {
          total,
          limit,
          skip,
        },
      });
    }

    return Response.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Bets fetch error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}