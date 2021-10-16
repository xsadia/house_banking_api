import { GraphQLFloat, GraphQLObjectType, GraphQLString } from "graphql";
import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
} from "graphql-relay";
import { ExpenseConnection } from "../expense/ExpenseType";
import { nodeInterface } from "../node/nodeDefinition";
import { User } from "../user/UserModel";
import { UserConnection, UserType } from "../user/UserType";

export const HouseHoldType = new GraphQLObjectType({
  name: "HouseHold",
  description: "HouseHoldType",
  fields: () => ({
    id: globalIdField("HouseHold"),
    houseChief: {
      type: UserType,
      resolve: async ({ houseChief }) => {
        const foundHouseChief = await User.findOne({ _id: houseChief });

        return foundHouseChief;
      },
    },
    houseHoldName: {
      type: GraphQLString,
      resolve: ({ houseHoldName }) => houseHoldName,
    },
    totalRevenue: {
      type: GraphQLFloat,
      resolve: ({ totalRevenue }) => totalRevenue,
    },
    residents: {
      type: UserConnection,
      args: connectionArgs,
      resolve: async (houseHold, args, context) => {
        const residents = await User.find({ houseHolds: houseHold.id });

        return connectionFromArray(residents, args);
      },
    },
    expenses: {
      type: ExpenseConnection,
      resolve: ({ expenses }) => expenses,
    },
    inviteCode: {
      type: GraphQLString,
      resolve: ({ inviteCode }) => inviteCode,
    },
    createdAt: {
      type: GraphQLString,
      resolve: ({ createdAt }) => createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: ({ updatedAt }) => updatedAt,
    },
    deletedAt: {
      type: GraphQLString,
      resolve: ({ deletedAt }) => deletedAt,
    },
  }),
  interfaces: () => [nodeInterface],
});

const { connectionType: HouseHoldConnection, edgeType: HouseHoldEdge } =
  connectionDefinitions({
    name: "HouseHold",
    nodeType: HouseHoldType,
  });

export { HouseHoldConnection, HouseHoldEdge };
