import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { HouseHold } from "../../houseHold/HouseHoldModel";
import { User } from "../../user/UserModel";
import { Expense } from "../ExpenseModel";

export default mutationWithClientMutationId({
  name: "AddResponsable",
  description: "Add responsable mutation",
  inputFields: {
    houseHoldId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    expenseId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    userId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async ({ houseHoldId, expenseId, userId }, { user }) => {
    if (!user.id) {
      return {
        success: false,
        error: "Permission denied",
      };
    }

    const { id: houseHoldIdFromGlobal } = fromGlobalId(houseHoldId);

    const houseHoldExists = await HouseHold.findOne({
      _id: houseHoldIdFromGlobal,
    });

    if (!houseHoldExists) {
      return {
        success: false,
        error: "Household not found",
      };
    }

    const userIsResident = houseHoldExists.residents.includes(user.id);

    if (!userIsResident) {
      return {
        success: false,
        error: "Permission denied",
      };
    }

    const { id: expenseIdFromGlobal } = fromGlobalId(expenseId);

    const expenseExists = await Expense.findOne({ _id: expenseIdFromGlobal });

    if (!expenseExists) {
      return {
        success: false,
        error: "Expense not found",
      };
    }

    const { id: userIdFromGlobal } = fromGlobalId(userId);

    const userExists = await User.findOne({ _id: userIdFromGlobal });

    if (!userExists) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const responsableIsResident =
      houseHoldExists.residents.includes(userIdFromGlobal);

    if (!responsableIsResident) {
      return {
        success: false,
        error: "User is not a resident",
      };
    }

    expenseExists.responsable = userExists._id;

    await expenseExists.save();

    return {
      success: true,
      error: null,
    };
  },
  outputFields: {
    success: {
      type: GraphQLBoolean,
      resolve: ({ success }) => success,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
