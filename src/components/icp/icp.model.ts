import { Schema, Document, model } from "mongoose";

export interface IIcp extends Document {
  
}

const IcpSchema = new Schema(
    {

    }
);

export const IcpModel = model<IIcp>("icps", IcpSchema);
