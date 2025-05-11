import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";

const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  }),
});

export default CategoryType;
