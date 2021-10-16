import { compare } from "bcryptjs";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { sign } from "jsonwebtoken";
import { authConfig } from "../../../config/authConfig";
import { User } from "../UserModel";
import { UserType } from "../UserType";

export default mutationWithClientMutationId({
  name: "Login",
  description: "Login mutation",
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ email, password }) => {
    const userExists = await User.findOne({ email });

    if (!userExists) {
      return {
        id: null,
        token: null,
        error: "Wrong e-mail/password combination",
      };
    }

    const passwordMatch = await compare(password, userExists.password);

    if (!passwordMatch) {
      return {
        id: null,
        token: null,
        error: "Wrong e-mail/password combination",
      };
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: userExists._id.toString(),
      expiresIn,
    });

    return {
      id: userExists._id,
      token,
      error: null,
    };
  },
  outputFields: {
    me: {
      type: UserType,
      resolve: async ({ id }) => {
        const user = await User.findOne({ _id: id });

        return user;
      },
    },
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
