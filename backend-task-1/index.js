const { PrismaClient } = require("@prisma/client");
const { ApolloServer } = require("apollo-server");
const { readFileSync } = require("fs");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Post = require("./resolvers/Post");
const prisma = new PrismaClient();
const typeDefs = readFileSync("./schema.graphql", "utf8");
const { getUserId } = require("./utils");

const resolvers = {
  Query,
  Mutation,
  User,
  Post,
};
// const resolvers = {
//   Query: {
//     info: () => `This is the API of some random social media site idrk`,
//     feed: async (parent, args, context) => {
//       return context.prisma.post.findMany();
//     },
//   },
//   Mutation: {
//     create: async (parent, args, context, info) => {
//       const newpost = context.prisma.post.create({
//         data: {
//           title: args.title,
//           body: args.body,
//         },
//       });
//       return newpost;
//     },
//     update: async (parent, args, context, info) => {
//       const updatepost = await context.prisma.post.update({
//         where: { id: parseInt(args.id) },
//         data: {
//           title: args.title,
//           body: args.body,
//         },
//       });
//       return updatepost;
//     },
//     delete: async (parent, args, context, info) => {
//       const deletedPost = await prisma.post.delete({
//         where: { id: parseInt(args.id) },
//       });
//       return deletedPost;
//     },
//   },
// };

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
