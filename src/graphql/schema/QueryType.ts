import { GraphQLString, GraphQLObjectType } from "graphql";
import { fromGlobalId } from "graphql-relay";
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
  }),
});
