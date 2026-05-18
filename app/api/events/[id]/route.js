// app/api/events/[id]/route.js - Get/Update specific event

import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';

// GET /api/events/[id] - Get event by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const event = await Event.findById(id);

    if (!event) {
      return Response.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Event fetch error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update event (admin only)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { status, result, live } = await request.json();

    const updateData = {};
    if (status) updateData.status = status;
    if (result !== undefined) updateData.result = result;
    if (live !== undefined) updateData.live = live;

    const event = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!event) {
      return Response.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    console.error('Event update error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}