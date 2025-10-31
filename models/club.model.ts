import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user.model';

export interface IClub extends Document {
  name: string;
  description: string;
  logoUrl?: string;
  coordinator: mongoose.Types.ObjectId | IUser;
  members: Array<mongoose.Types.ObjectId | IUser>;
  createdAt: Date;
  updatedAt: Date;
}

const ClubSchema = new Schema<IClub>(
  {
    name: {
      type: String,
      required: [true, 'Club name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Club description is required'],
    },
    logoUrl: {
      type: String,
    },
    coordinator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true }
);

// Note: Index is already created by unique: true on name field, so no need for ClubSchema.index({ name: 1 })

const ClubModel = mongoose.models.Club || mongoose.model<IClub>('Club', ClubSchema);
export default ClubModel;