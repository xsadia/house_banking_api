import { hash } from "bcryptjs";
import { GraphQLFloat, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { sign } from "jsonwebtoken";
import { authConfig } from "../../../config/authConfig";
import { User } from "../UserModel";
import { UserType } from "../UserType";

export default mutationWithClientMutationId({
  name: "CreateUser",
  description: "Create user mutation",
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
    confirmPassword: {
      type: new GraphQLNonNull(GraphQLString),
    },
    monthlyWage: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
  mutateAndGetPayload: async ({
    email,
    username,
    password,
    confirmPassword,
    monthlyWage,
  }) => {
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return {
        id: null,
        token: null,
        error: "Email already in use",
      };
    }

    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
      return {
        id: null,
        token: null,
        error: "Username already in use",
      };
    }

    if (password !== confirmPassword) {
      return {
        id: null,
        token: null,
        error: "Passwords should match",
      };
    }

    const hashedPassword = await hash(password, 8);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      monthlyWage: monthlyWage * 100,
    });

    await user.save();

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user._id.toString(),
      expiresIn,
    });

    return {
      id: user._id,
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
