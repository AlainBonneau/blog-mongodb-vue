import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from "graphql";
import UserType from "./types/UserType.js";
import PostType from "./types/PostType.js";
import CommentType from "./types/CommentType.js";
import CategoryType from "./types/CategoryType.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Category from "../models/Category.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    postsByUser: {
      type: new GraphQLList(PostType),
      args: { userId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Post.find({ author: args.userId }).sort({ createdAt: -1 });
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      args: {
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
      },
      resolve(_, args) {
        const { limit = 5, offset = 0 } = args;
        return Post.find().skip(offset).limit(limit).sort({ createdAt: -1 });
      },
    },

    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return Post.findById(args.id);
      },
    },

    postsByCategory: {
      type: new GraphQLList(PostType),
      args: { categoryId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return Post.find({ category: args.categoryId }).sort({ createdAt: -1 });
      },
    },

    searchPosts: {
      type: new GraphQLList(PostType),
      args: { keyword: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(_, { keyword }) {
        const regex = new RegExp(keyword, "i");
        return Post.find({ $or: [{ title: regex }, { content: regex }] }).sort({
          createdAt: -1,
        });
      },
    },

    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },

    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find();
      },
    },

    categories: {
      type: new GraphQLList(CategoryType),
      resolve() {
        return Category.find();
      },
    },

    postsByCategory: {
      type: new GraphQLList(PostType),
      args: { categoryId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return Post.find({ category: args.categoryId });
      },
    },

    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args) {
        return Comment.find().sort({ createdAt: -1 });
      },
    },

    commentsByPost: {
      type: new GraphQLList(CommentType),
      args: {
        postId: { type: new GraphQLNonNull(GraphQLID) },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
      },
      resolve(_, { postId, limit = 5, offset = 0 }) {
        return Comment.find({ post: postId })
          .skip(offset)
          .limit(limit)
          .sort({ createdAt: -1 });
      },
    },

    me: {
      type: UserType,
      resolve(_, __, context) {
        if (!context.user) {
          throw new Error("Non connecté");
        }
        return User.findById(context.user.userId);
      },
    },
  },
});

export default RootQuery;
