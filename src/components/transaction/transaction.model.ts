import { Schema, Document, model, Types } from "mongoose";

export interface ITransaction extends Document {
  amount: string;
  from: Types.ObjectId;
  to: Types.ObjectId;
  time: Date;
}

const TransactionSchema = new Schema({
  amount: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now(),
  },
});

export const TransactionModel = model<ITransaction>(
  "transactions",
  TransactionSchema
);
