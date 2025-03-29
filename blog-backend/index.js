import express from "express";
import mongoose from "mongoose";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema/index.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("Connecté à MongoDB");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(
    `Serveur GraphQL en cours d'exécution sur http://localhost:${PORT}/graphql`
  );
});
