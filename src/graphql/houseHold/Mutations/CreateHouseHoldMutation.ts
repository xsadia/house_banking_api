import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId, toGlobalId } from "graphql-relay";
import { User } from "../../user/UserModel";
import { HouseHold } from "../HouseHoldModel";
import { HouseHoldEdge } from "../HouseHoldType";

export default mutationWithClientMutationId({
  name: "CreateHouseHold",
  description: "Create household mutation",
  inputFields: {
    houseHoldName: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ houseHoldName }, { user }) => {
    if (!user.id) {
      return {
        id: null,
        error: "Permission denied",
      };
    }

    const userExists = await User.findOne({ _id: user.id });

    if (!userExists) {
      return {
        id: null,
        error: "Permission denied",
      };
    }

    if (userExists.houseHolds.length > 3) {
      return {
        id: null,
        error: "You can only have 3 households",
      };
    }

    const userAlreadyUsedHouseHoldName = await HouseHold.findOne({
      houseChief: user.id,
      houseHoldName,
    });

    if (userAlreadyUsedHouseHoldName) {
      return {
        id: null,
        error: "You already registered a household with this name",
      };
    }

    const houseHold = new HouseHold({
      houseChief: userExists._id,
      houseHoldName,
      totalRevenue: userExists.monthlyWage,
    });

    userExists.houseHolds.addToSet(houseHold._id);
    houseHold.residents.addToSet(userExists._id);

    await userExists.save();
    await houseHold.save();

    return {
      id: houseHold._id,
      error: null,
    };
  },
  outputFields: {
    houseHold: {
      type: HouseHoldEdge,
      resolve: async ({ id }) => {
        const houseHold = await HouseHold.findOne({ _id: id });

        if (!houseHold) {
          return null;
        }

        return {
          cursor: toGlobalId("HouseHold", houseHold._id),
          node: houseHold,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
