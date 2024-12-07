import { Document } from "mongoose";

export interface IICPDTO {
  _id?: string;
  public_key: string;
  private_key: string;
  balance: number;
  principal: string;
  account_id: string;
  gas_bal: number;
  user?: string;
}

export interface ICPDocument extends Document {
  public_key: string;
  private_key: string;
  balance: number;
  principal: string;
  account_id: string;
  gas_bal: number;
  user?: string;
}
