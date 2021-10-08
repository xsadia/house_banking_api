import { GraphQLString, GraphQLObjectType } from "graphql";

export const QueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root of all queries",
  fields: () => ({
    hi: {
      type: GraphQLString,
      resolve: () => {
        return "Hello world";
      },
    },
  }),
});
