import { Document, Schema, model, Types } from "mongoose";
import { IExpense } from "../expense/ExpenseModel";
import { IUser } from "../user/UserModel";

export interface IHouseHold extends Document {
  houseHoldName: string;
  houseChief: IUser["_id"];
  totalRevenue: number;
  residents: Types.Array<IUser["_id"]>;
  expenses: Types.Array<IExpense["_id"]>;
  inviteCode: string;
  inviteCodeExpirationDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const HouseHoldSchema = new Schema({
  houseHoldName: {
    type: String,
    required: true,
  },
  houseChief: {
    type: Types.ObjectId,
    ref: "User",
  },
  totalRevenue: {
    type: Number,
    default: 0.0,
  },
  residents: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  expenses: [
    {
      type: Types.ObjectId,
      ref: "Expense",
    },
  ],
  inviteCode: {
    type: String,
  },
  inviteCodeExpirationDate: {
    type: Date,
  },
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

export const HouseHold = model<IHouseHold>("HouseHold", HouseHoldSchema);
