import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./schema/index.js";
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST"],
};

const corsMiddleware = cors(corsOptions);

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

app.use(corsMiddleware);

app.use(
  "/graphql",
  createHandler({
    schema,
    context: async (req) => {
      const auth = req.headers["authorization"];
      let user = null;

      if (auth && auth.startsWith("Bearer ")) {
        const token = auth.split(" ")[1];
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          user = decoded; // ⚠️ garde tout le payload
        } catch (err) {
          console.warn("Invalid token");
        }
      }

      return { user };
    },
  })
);

app.listen(PORT, () => {
  console.log(`🚀 GraphQL running at http://localhost:${PORT}/graphql`);
});
