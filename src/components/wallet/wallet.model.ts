import { Schema, Document, model, Types, Model } from "mongoose";
import { ICPDocument } from "./types";

interface IICP extends ICPDocument {}

export interface IICPModel extends Model<IICP> {}

const WalletSchema = new Schema<IICP, IICPModel>({
  public_key: {
    type: String,
    required: true,
    unique: true,
  },
  private_key: {
    type: String,
    required: true,
    unique: true,
  },
  principal: {
    type: String,
    required: true,
    unique: true,
  },
  account_id: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  gas_bal: {
    type: Number,
    default: 0,
  },
  user: {
    type: String,
    required: true,
  },
});

export const WalletModel = model<IICP, IICPModel>("wallets", WalletSchema);
