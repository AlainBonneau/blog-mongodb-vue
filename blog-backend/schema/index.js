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
  GraphQLInt,
  GraphQLBoolean,
} from "graphql";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Category from "../models/Category.js";

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

const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  }),
});

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
        return Comment.find();
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
        return User.findById(context.user);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCategory: {
      type: CategoryType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(_, args) {
        const category = new Category({
          name: args.name,
        });
        return category.save();
      },
    },

    addPost: {
      type: PostType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: GraphQLString },
        category: { type: GraphQLID },
      },
      async resolve(_, args, context) {
        if (!context.user) throw new Error("Non connecté");

        const currentUser = await User.findById(context.user);
        if (!currentUser || currentUser.role !== "auteur") {
          throw new Error("Accès réservé aux auteurs");
        }

        const post = new Post({
          title: args.title,
          content: args.content,
          image:
            args.image ||
            "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg",
          category: args.category,
          author: currentUser.id,
        });

        return post.save();
      },
    },

    deletePost: {
      type: GraphQLString,
      args: {
        postId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(_, { postId }, context) {
        if (!context.user) {
          throw new Error("Non connecté");
        }

        const currentUser = await User.findById(context.user);
        const post = await Post.findById(postId);

        if (!post) {
          throw new Error("Article introuvable");
        }

        // Règle de permission
        const isAuthor = post.author.toString() === currentUser.id;
        const isAdmin = currentUser.role === "admin";

        if (!isAuthor && !isAdmin) {
          throw new Error("Non autorisé à supprimer cet article");
        }

        await Post.findByIdAndDelete(postId);
        return "Article supprimé";
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

    deleteComment: {
      type: GraphQLString,
      args: {
        commentId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(_, { commentId }, context) {
        if (!context.user) {
          throw new Error("Non connecté");
        }

        const user = await User.findById(context.user);
        if (user.role !== "admin") {
          throw new Error("Non autorisé");
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
          throw new Error("Commentaire introuvable");
        }

        await Comment.findByIdAndDelete(commentId);
        return "Commentaire supprimé";
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

        const token = jwt.sign(
          { userId: user.id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return token;
      },
    },

    register: {
      type: GraphQLString,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: GraphQLString },
      },
      async resolve(_, args) {
        const existing = await User.findOne({ email: args.email });
        if (existing) throw new Error("Email déjà utilisé");

        const hashedPassword = await bcrypt.hash(args.password, 10);
        const user = await new User({
          name: args.name,
          email: args.email,
          role: args.role || "utilisateur",
          password: hashedPassword,
        }).save();

        const token = jwt.sign(
          { userId: user.id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return token;
      },
    },

    updateUserName: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, { name }, context) {
        if (!context.user) throw new Error("Non autorisé");

        const user = await User.findByIdAndUpdate(
          context.user,
          { name },
          { new: true }
        );

        return user;
      },
    },

    updateUSerPassword: {
      type: GraphQLBoolean,
      args: {
        oldPassword: { type: new GraphQLNonNull(GraphQLString) },
        newPassword: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, { oldPassword, newPassword }, context) {
        if (!context.user) throw new Error("Non autorisé");

        const user = await User.findById(context.user);
        if (!user) throw new Error("Utilisateur introuvable");

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) throw new Error("Ancien mot de passe incorrect");

        const saltRound = 10;
        user.password = await bcrypt.hash(newPassword, saltRound);
        await user.save();

        return true;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
