import mongoose, { Schema, Document } from 'mongoose';
import { IDonation } from '../types';

export interface IDonationDocument extends IDonation, Document {}

const donationSchema = new Schema<IDonationDocument>({
  donor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Donor is required']
  },
  amount: {
    type: Number,
    required: [true, 'Donation amount is required'],
    min: [0.01, 'Donation amount must be greater than 0']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR']
  },
  purpose: {
    type: String,
    trim: true
  },
  anonymous: {
    type: Boolean,
    default: false
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'cash']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Index for queries
donationSchema.index({ donor: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({ transactionId: 1 });

export const Donation = mongoose.model<IDonationDocument>('Donation', donationSchema); 