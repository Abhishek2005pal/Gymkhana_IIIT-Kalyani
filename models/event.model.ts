import mongoose, { Document, Schema } from 'mongoose';
import { IClub } from './club.model';
import { IUser } from './user.model';

export interface IEvent extends Document {
  title: string;
  description: string;
  club: mongoose.Types.ObjectId | IClub;
  date: Date;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredUsers: Array<mongoose.Types.ObjectId | IUser>;
  registrationLimit?: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    registeredUsers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    registrationLimit: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Create indexes for common queries
EventSchema.index({ club: 1 });
EventSchema.index({ date: 1 });
EventSchema.index({ status: 1 });

const EventModel = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
export default EventModel;