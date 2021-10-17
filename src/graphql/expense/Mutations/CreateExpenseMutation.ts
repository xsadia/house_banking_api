import {
  GraphQLFloat,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import {
  fromGlobalId,
  mutationWithClientMutationId,
  toGlobalId,
} from "graphql-relay";
import { HouseHold } from "../../houseHold/HouseHoldModel";
import { Expense } from "../ExpenseModel";
import { ExpenseEdge } from "../ExpenseType";

export default mutationWithClientMutationId({
  name: "CreateExpense",
  description: "Create expense mutation",
  inputFields: {
    houseHoldId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    price: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
  mutateAndGetPayload: async ({ houseHoldId, name, price }, { user }) => {
    if (!user.id) {
      return {
        id: null,
        error: "Permission denied",
      };
    }

    const { id } = fromGlobalId(houseHoldId);

    const houseHoldExists = await HouseHold.findOne({ _id: id });

    if (!houseHoldExists) {
      return {
        id: null,
        error: "Household not found",
      };
    }

    const userIsResident = houseHoldExists.residents.includes(user.id);

    if (!userIsResident) {
      return {
        id: null,
        error: "Permission denied",
      };
    }

    const nameAlreadyInUse = await Expense.findOne({
      name,
      belongsTo: houseHoldExists._id,
    });

    if (nameAlreadyInUse) {
      return {
        id: null,
        error: "Expense already exists",
      };
    }

    const expense = new Expense({
      name,
      price,
      belongsTo: houseHoldExists._id,
    });

    houseHoldExists.expenses.addToSet(expense._id);

    await expense.save();
    await houseHoldExists.save();

    return {
      id: expense._id,
      error: null,
    };
  },
  outputFields: {
    expense: {
      type: ExpenseEdge,
      resolve: async ({ id }) => {
        const expense = await Expense.findOne({ _id: id });

        if (!expense) {
          return null;
        }

        return {
          cursor: toGlobalId("Expense", expense._id),
          node: expense,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
