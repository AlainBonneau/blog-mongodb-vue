import { GraphQLSchema } from "graphql";
import RootQuery from "./queries.js";
import Mutation from "./mutations.js";

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
