import { GraphQLFloat, GraphQLObjectType } from "graphql";
import { connectionDefinitions, globalIdField } from "graphql-relay";
import { HouseHoldType } from "../houseHold/HouseHoldType";
import { nodeInterface } from "../node/nodeDefinition";
import { UserType } from "../user/UserType";

export const ExpenseType = new GraphQLObjectType({
  name: "Expense",
  description: "ExpenseType",
  fields: () => ({
    id: globalIdField("Expense"),
    price: {
      type: GraphQLFloat,
      resolve: ({ price }) => price,
    },
    responsable: {
      type: UserType,
      resolve: ({ responsable }) => responsable,
    },
    houseHold: {
      type: HouseHoldType,
      resolve: ({ houseHold }) => houseHold,
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
