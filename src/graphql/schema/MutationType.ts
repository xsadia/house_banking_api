import { GraphQLObjectType } from "graphql";
import UserMutations from "../user/Mutations";
import HouseHoldMutations from "../houseHold/Mutations";

export const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "Root of all mutations",
  fields: () => ({
    ...UserMutations,
    ...HouseHoldMutations,
  }),
});
