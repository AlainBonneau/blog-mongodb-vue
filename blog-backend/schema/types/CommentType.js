import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";
import UserType from "./UserType.js";
import PostType from "./PostType.js";
import User from "../../models/User.js";
import Post from "../../models/Post.js";

const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: () => ({
    id: { type: GraphQLID },
    text: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    author: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.author);
      },
    },
    post: {
      type: PostType,
      resolve(parent, args) {
        return Post.findById(parent.post);
      },
    },
  }),
});

export default CommentType;
