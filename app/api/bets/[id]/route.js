// app/api/bets/[id]/route.js - Get/Settle specific bet

import { connectDB } from '@/lib/mongodb';
import Bet from '@/models/Bet';
import User from '@/models/User';

// GET /api/bets/[id] - Get bet by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const bet = await Bet.findById(id).populate('eventId');

    if (!bet) {
      return Response.json(
        { success: false, message: 'Bet not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: bet,
    });
  } catch (error) {
    console.error('Bet fetch error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/bets/[id] - Settle a bet (admin only)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { status, winnings, transactionHash } = await request.json();

    if (!['won', 'lost'].includes(status)) {
      return Response.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    const bet = await Bet.findById(id);
    if (!bet) {
      return Response.json(
        { success: false, message: 'Bet not found' },
        { status: 404 }
      );
    }

    bet.status = status;
    bet.settled = true;
    bet.settledAt = new Date();
    if (winnings !== undefined) bet.winnings = winnings;
    if (transactionHash) bet.transactionHash = transactionHash;

    await bet.save();

    // Update user stats
    if (status === 'won') {
      await User.findByIdAndUpdate(bet.userId, {
        $inc: { totalWinnings: winnings || bet.potentialWin },
      });
    } else {
      await User.findByIdAndUpdate(bet.userId, {
        $inc: { totalLosses: bet.amount },
      });
    }

    return Response.json({
      success: true,
      message: `Bet marked as ${status}`,
      data: bet,
    });
  } catch (error) {
    console.error('Bet settlement error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}