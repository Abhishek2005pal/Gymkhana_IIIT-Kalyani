import { compare, hash } from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'coordinator' | 'admin';
  studentId?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    role: {
      type: String,
      enum: ['student', 'coordinator', 'admin'],
      default: 'student',
    },
    studentId: {
      type: String,
      sparse: true,
    },
  },
  { timestamps: true }
);

// Create index for email
// UserSchema.index({ email: 1 });

// Hash the password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await hash(this.password, 12);
    return next();
  } catch (error) {
    return next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return compare(candidatePassword, this.password);
};

const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default UserModel;