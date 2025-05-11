import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from "graphql";
import PostType from "./PostType.js";
import Post from "../../models/Post.js";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    avatar: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({ author: parent.id });
      },
    },
  }),
});

export default UserType;
