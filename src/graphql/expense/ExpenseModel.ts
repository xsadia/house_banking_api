import { Schema, model, Types, Document } from "mongoose";
import { IHouseHold } from "../houseHold/HouseHoldModel";
import { IUser } from "../user/UserModel";

export interface IExpense extends Document {
  name: string;
  price: number;
  responsable: IUser["_id"];
  belongsTo: IHouseHold["_id"];
}

const ExpenseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  responsable: {
    type: Types.ObjectId,
    ref: "User",
  },
  belongsTo: {
    type: Types.ObjectId,
    ref: "HouseHold",
  },
});

export const Expense = model<IExpense>("Expense", ExpenseSchema);
