import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
} from "graphql";
import {
  connectionArgs,
  connectionFromArray,
  fromGlobalId,
} from "graphql-relay";
import { Expense } from "../expense/ExpenseModel";
import { ExpenseConnection } from "../expense/ExpenseType";
import { HouseHold } from "../houseHold/HouseHoldModel";
import { HouseHoldConnection, HouseHoldType } from "../houseHold/HouseHoldType";
import { User } from "../user/UserModel";
import { UserType } from "../user/UserType";

export const QueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root of all queries",
  fields: () => ({
    hi: {
      type: GraphQLString,
      resolve: () => "Hello, world",
    },
    me: {
      type: UserType,
      resolve: async (root, args, { user }) => {
        if (!user.id) {
          const me = null;
          return me;
        }

        const me = await User.findOne({ _id: user.id });

        return me;
      },
    },
    userHouseHolds: {
      type: HouseHoldConnection,
      args: connectionArgs,
      resolve: async (root, args, { user }) => {
        if (!user.id) {
          const userHouseHolds = null;
          return userHouseHolds;
        }

        const houseHolds = await HouseHold.find({ residents: user.id });

        return connectionFromArray(houseHolds, args);
      },
    },
    houseHoldById: {
      type: HouseHoldType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (root, { id: globalId }, { user }) => {
        if (!user.id) {
          const houseHold = null;
          return houseHold;
        }

        const { id } = fromGlobalId(globalId);

        const houseHold = await HouseHold.findOne({ _id: id });

        if (!houseHold) {
          const houseHold = null;
          return houseHold;
        }

        const userIsResident = houseHold.residents.includes(user.id);

        if (!userIsResident) {
          const houseHold = null;
          return houseHold;
        }

        return houseHold;
      },
    },
    userExpenses: {
      type: ExpenseConnection,
      args: connectionArgs,
      resolve: async (root, args, { user }) => {
        if (!user.id) {
          const expenses = null;
          return expenses;
        }

        const expenses = await Expense.find({ responsable: user.id });

        if (!expenses) {
          const expenses = null;
          return expenses;
        }

        return connectionFromArray(expenses, args);
      },
    },
  }),
});
