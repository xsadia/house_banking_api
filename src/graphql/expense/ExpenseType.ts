import { GraphQLFloat, GraphQLObjectType, GraphQLString } from "graphql";
import { connectionDefinitions, globalIdField } from "graphql-relay";
import { HouseHold } from "../houseHold/HouseHoldModel";
import { HouseHoldType } from "../houseHold/HouseHoldType";
import { nodeInterface } from "../node/nodeDefinition";
import { User } from "../user/UserModel";
import { UserType } from "../user/UserType";

export const ExpenseType = new GraphQLObjectType({
  name: "Expense",
  description: "ExpenseType",
  fields: () => ({
    id: globalIdField("Expense"),
    name: {
      type: GraphQLString,
      resolve: ({ name }) => name,
    },
    price: {
      type: GraphQLFloat,
      resolve: ({ price }) => price,
    },
    responsable: {
      type: UserType,
      resolve: async ({ responsable }) => {
        const responsableUser = await User.findOne({ _id: responsable });

        return responsableUser;
      },
    },
    belongsTo: {
      type: HouseHoldType,
      resolve: async ({ belongsTo }) => {
        const houseHold = await HouseHold.findOne({ _id: belongsTo });

        return houseHold;
      },
    },
  }),
  interfaces: () => [nodeInterface],
});

const { connectionType: ExpenseConnection, edgeType: ExpenseEdge } =
  connectionDefinitions({
    name: "Expense",
    nodeType: ExpenseType,
  });

export { ExpenseConnection, ExpenseEdge };
