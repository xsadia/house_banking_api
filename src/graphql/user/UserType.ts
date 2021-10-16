import { GraphQLFloat, GraphQLObjectType, GraphQLString } from "graphql";
import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  globalIdField,
} from "graphql-relay";
import { HouseHold } from "../houseHold/HouseHoldModel";
import { HouseHoldConnection } from "../houseHold/HouseHoldType";
import { nodeInterface } from "../node/nodeDefinition";

export const UserType = new GraphQLObjectType({
  name: "User",
  description: "UserType",
  fields: () => ({
    id: globalIdField("User"),
    username: {
      type: GraphQLString,
      resolve: ({ username }) => username,
    },
    email: {
      type: GraphQLString,
      resolve: ({ email }) => email,
    },
    password: {
      type: GraphQLString,
      resolve: ({ password }) => password,
    },
    monthlyWage: {
      type: GraphQLFloat,
      resolve: ({ monthlyWage }) => monthlyWage,
    },
    houseHolds: {
      type: HouseHoldConnection,
      args: connectionArgs,
      resolve: async (user, args, context) => {
        const houseHolds = await HouseHold.find({ residents: user._id });

        return connectionFromArray(houseHolds, args);
      },
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

const { connectionType: UserConnection, edgeType: UserEdge } =
  connectionDefinitions({
    name: "User",
    nodeType: UserType,
  });

export { UserConnection, UserEdge };
