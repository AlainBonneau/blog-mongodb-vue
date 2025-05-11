import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";
import UserType from "./UserType.js";
import CategoryType from "./CategoryType.js";
import User from "../../models/User.js";
import Category from "../../models/Category.js";

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    author: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.author);
      },
    },
    image: { type: GraphQLString },
    category: {
      type: CategoryType,
      resolve(parent) {
        return Category.findById(parent.category);
      },
    },
  }),
});

export default PostType;
