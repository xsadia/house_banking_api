import { Document, Schema, model, Types } from "mongoose";
import { IHouseHold } from "../houseHold/HouseHoldModel";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  monthlyWage: number;
  houseHolds: Types.Array<IHouseHold>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  monthlyWage: {
    type: Number,
    default: 0.0,
  },
  houseHolds: [
    {
      type: Types.ObjectId,
      ref: "HouseHold",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
  },
});

export const User = model<IUser>("User", UserSchema);
