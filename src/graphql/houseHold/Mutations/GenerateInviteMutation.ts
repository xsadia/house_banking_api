import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { v4 as uuid } from "uuid";
import { HouseHold } from "../HouseHoldModel";
import { HouseHoldType } from "../HouseHoldType";

export default mutationWithClientMutationId({
  name: "GenerateInvite",
  description: "Generate invite mutation",
  inputFields: {
    isExpirable: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    houseHoldId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async ({ houseHoldId, isExpirable }, { user }) => {
    if (!user.id) {
      return {
        inviteCode: null,
        error: "Permission denied",
      };
    }

    const { id: houseHoldIdFromGlobal } = fromGlobalId(houseHoldId);

    const houseHoldExists = await HouseHold.findOne({
      _id: houseHoldIdFromGlobal,
    });

    if (!houseHoldExists) {
      return {
        inviteCode: null,
        error: "Household not found",
      };
    }

    const userIsResident = houseHoldExists.residents.includes(user.id);

    if (!userIsResident) {
      return {
        inviteCode: null,
        error: "Permission denied",
      };
    }

    if (isExpirable) {
      houseHoldExists.inviteCode = uuid();

      const oneWeekFromNow = new Date();

      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

      houseHoldExists.inviteCodeExpirationDate = oneWeekFromNow;

      await houseHoldExists.save();

      return {
        inviteCode: houseHoldExists.inviteCode,
        error: null,
      };
    }

    houseHoldExists.inviteCode = uuid();

    await houseHoldExists.save();

    return {
      inviteCode: houseHoldExists.inviteCode,
      error: null,
    };
  },
  outputFields: {
    houseHold: {
      type: HouseHoldType,
      resolve: async ({ inviteCode }) => {
        const houseHold = await HouseHold.findOne({ inviteCode });

        return houseHold;
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
