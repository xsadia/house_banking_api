import { GraphQLObjectType } from "graphql";
import UserMutations from "../user/Mutations";
import HouseHoldMutations from "../houseHold/Mutations";
import ExpenseMutations from "../expense/Mutations";

export const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "Root of all mutations",
  fields: () => ({
    ...UserMutations,
    ...HouseHoldMutations,
    ...ExpenseMutations,
  }),
});
