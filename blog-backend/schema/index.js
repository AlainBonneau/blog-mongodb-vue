import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
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
import Comment from "../models/Comment.js";

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
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({ author: parent.id });
      },
    },
  }),
});

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

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    postsByUser: {
      type: new GraphQLList(PostType),
      args: { userId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Post.find({ author: args.userId });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find();
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
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args) {
        return Comment.find();
      },
    },
    commentsByPost: {
      type: new GraphQLList(CommentType),
      args: { postId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Comment.find({ post: args.postId });
      },
    },
    me: {
      type: UserType,
      resolve(_, __, context) {
        if (!context.user) {
          throw new Error("Non connecté");
        }
        return User.findById(context.user);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const user = new User({
          name: args.name,
          email: args.email,
          password: args.password,
        });
        return user.save();
      },
    },

    addPost: {
      type: PostType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(_, args, context) {
        if (!context.user) {
          throw new Error("Non autorisé");
        }

        const post = new Post({
          title: args.title,
          content: args.content,
          author: context.user,
        });

        return post.save();
      },
    },

    addComment: {
      type: CommentType,
      args: {
        text: { type: new GraphQLNonNull(GraphQLString) },
        post: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(_, args, context) {
        if (!context.user) {
          throw new Error("Non autorisé");
        }

        const comment = new Comment({
          text: args.text,
          author: context.user,
          post: args.post,
        });

        return comment.save();
      },
    },

    login: {
      type: GraphQLString,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args) {
        const user = await User.findOne({ email: args.email });
        if (!user) throw new Error("Utilisateur non trouvé");

        const isMatch = await bcrypt.compare(args.password, user.password);
        if (!isMatch) throw new Error("Mot de passe incorrect");

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        return token;
      },
    },

    register: {
      type: GraphQLString,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args) {
        const existing = await User.findOne({ email: args.email });
        if (existing) throw new Error("Email déjà utilisé");

        const hashedPassword = await bcrypt.hash(args.password, 10);
        const user = await new User({
          name: args.name,
          email: args.email,
          password: hashedPassword,
        }).save();

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        return token;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
