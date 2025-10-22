import mongoose, { Document, Schema } from 'mongoose';
import { IClub } from './club.model';

interface IExpense {
  description: string;
  amount: number;
  date: Date;
}

export interface IBudget extends Document {
  club: mongoose.Types.ObjectId | IClub;
  allocatedAmount: number;
  expenses: IExpense[];
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>({
  description: {
    type: String,
    required: [true, 'Expense description is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Expense amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const BudgetSchema = new Schema<IBudget>(
  {
    club: {
      type: Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
      unique: true,
    },
    allocatedAmount: {
      type: Number,
      required: [true, 'Allocated amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    expenses: [ExpenseSchema],
  },
  { timestamps: true }
);

const BudgetModel = mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);
export default BudgetModel;