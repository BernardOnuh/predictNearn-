// app/api/events/route.js - Events API Routes

import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';

// GET /api/events - Get all events with filtering
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = parseInt(searchParams.get('skip')) || 0;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    const events = await Event.find(query)
      .sort({ startTime: 1 })
      .limit(limit)
      .skip(skip);

    const total = await Event.countDocuments(query);

    return Response.json({
      success: true,
      data: events,
      pagination: {
        total,
        limit,
        skip,
      },
    });
  } catch (error) {
    console.error('Events fetch error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event (admin only)
export async function POST(request) {
  try {
    await connectDB();
    const { title, league, category, odds, startTime, description, image, live } = await request.json();

    // Validation
    if (!title || !league || !category || !odds || !startTime) {
      return Response.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (odds.length !== 3) {
      return Response.json(
        { success: false, message: 'Must provide exactly 3 odds' },
        { status: 400 }
      );
    }

    const validCategories = ['sports', 'entertainment', 'crypto', 'other'];
    if (!validCategories.includes(category)) {
      return Response.json(
        { success: false, message: 'Invalid category' },
        { status: 400 }
      );
    }

    const newEvent = new Event({
      title,
      league,
      category,
      odds,
      startTime: new Date(startTime),
      description: description || '',
      image: image || null,
      live: live || false,
    });

    await newEvent.save();

    return Response.json(
      {
        success: true,
        message: 'Event created successfully',
        data: newEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Event creation error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}