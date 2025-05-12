import { GraphQLObjectType } from "graphql";
import {
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLBoolean,
} from "graphql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserType from "./types/UserType.js";
import PostType from "./types/PostType.js";
import CommentType from "./types/CommentType.js";
import CategoryType from "./types/CategoryType.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Category from "../models/Category.js";

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

        const currentUser = await User.findById(context.user.userId);
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

        const currentUser = await User.findById(context.user.userId);
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
          author: context.user.userId,
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

        const user = await User.findById(context.user.userId);
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
          context.user.userId,
          { name },
          { new: true }
        );

        return user;
      },
    },

    updateUserPassword: {
      type: GraphQLBoolean,
      args: {
        oldPassword: { type: new GraphQLNonNull(GraphQLString) },
        newPassword: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, { oldPassword, newPassword }, context) {
        if (!context.user) throw new Error("Non autorisé");

        const user = await User.findById(context.user.userId);
        if (!user) throw new Error("Utilisateur introuvable");

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) throw new Error("Ancien mot de passe incorrect");

        const saltRound = 10;
        user.password = await bcrypt.hash(newPassword, saltRound);
        await user.save();

        return true;
      },
    },

    updateUserRole: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        role: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, { userId, role }, context) {
        if (!context.user || context.user.role !== "admin") {
          throw new Error("Non autorisé");
        }

        const validRoles = ["utilisateur", "auteur", "admin"];
        if (!validRoles.includes(role)) {
          throw new Error("Rôle invalide");
        }

        const user = await User.findByIdAndUpdate(
          userId,
          { role },
          { new: true }
        );
        if (!user) {
          throw new Error("Utilisateur introuvable");
        }

        return `Rôle mis à jour en ${role}`;
      },
    },

    deleteUser: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(_, { userId }, context) {
        if (!context.user || context.user.role !== "admin") {
          throw new Error("Non autorisé");
        }

        const user = await User.findById(userId);
        if (!user) {
          throw new Error("Utilisateur introuvable");
        }

        await User.findByIdAndDelete(userId);
        return "Utilisateur supprimé";
      },
    },
  },
});

export default Mutation;
