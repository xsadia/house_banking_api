import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from "graphql";
import { HouseHold } from "../HouseHoldModel";
import { User } from "../../user/UserModel";

export default mutationWithClientMutationId({
  name: "JoinHouseHold",
  description: "Join household mutation",
  inputFields: {
    inviteCode: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ inviteCode }, { user }) => {
    if (!user.id) {
      return {
        success: false,
        error: "Permission denied",
      };
    }

    const houseHoldExists = await HouseHold.findOne({ inviteCode });

    if (!houseHoldExists) {
      return {
        success: false,
        error: "Invalid invite code",
      };
    }

    const userIsResident = houseHoldExists.residents.includes(user.id);

    if (userIsResident) {
      return {
        success: false,
        error: "You're already a resident",
      };
    }

    const now = new Date();
    const expirationDate = houseHoldExists.inviteCodeExpirationDate;

    if (expirationDate && now > expirationDate) {
      return {
        success: false,
        error: "Invite code expired",
      };
    }

    const newResident = await User.findOne({ _id: user.id });

    houseHoldExists.residents.addToSet(newResident._id);

    houseHoldExists.totalRevenue += newResident.monthlyWage;

    newResident.houseHolds.addToSet(houseHoldExists._id);

    await houseHoldExists.save();

    await newResident.save();

    return {
      success: true,
      error: null,
    };
  },
  outputFields: {
    success: {
      type: GraphQLBoolean,
      resolve: ({ success }) => success,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
