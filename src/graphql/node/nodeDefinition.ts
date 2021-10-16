import { fromGlobalId, nodeDefinitions } from "graphql-relay";
import { Expense } from "../expense/ExpenseModel";
import { ExpenseType } from "../expense/ExpenseType";
import { HouseHold } from "../houseHold/HouseHoldModel";
import { HouseHoldType } from "../houseHold/HouseHoldType";
import { User } from "../user/UserModel";
import { UserType } from "../user/UserType";

export const { nodeInterface, nodeField, nodesField } = nodeDefinitions(
  async (globalId) => {
    const { id, type } = fromGlobalId(globalId);

    if (type === "User") {
      return await User.findOne({ _id: id });
    }

    if (type === "HouseHold") {
      return await HouseHold.findOne({ _id: id });
    }

    if (type === "Expense") {
      return await Expense.findOne({ _id: id });
    }

    return null;
  },
  (obj) => {
    if (obj instanceof User) {
      return UserType;
    }

    if (obj instanceof HouseHold) {
      return HouseHoldType;
    }

    if (obj instanceof Expense) {
      return ExpenseType;
    }

    return null;
  }
);
