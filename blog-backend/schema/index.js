import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} from "graphql";
import Post from "../models/Post.js";
import User from "../models/User.js";

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    auhtor: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.author);
      },
    },
  }),
});

// Faire la suite
