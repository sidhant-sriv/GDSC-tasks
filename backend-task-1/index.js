const { ApolloServer } = require("apollo-server");
const { readFileSync } = require("fs");

const typeDefs = readFileSync("./schema.graphql", "utf8");

let posts = [
  {
    id: "post-0",
    title: "Hello, World",
    body: "Kendrick Lamar is really good",
  },
];

const resolvers = {
  Query: {
    info: () => `This is the API of some random social media site idrk`,
    feed: () => posts,
  },
  Mutation: {
    create: (parent, args) => {
      //Right now, just adding shit to the posts array on line 6(?)
      let c = posts.length;
      const post = {
        id: `post-${c++}`,
        title: args.title,
        body: args.body,
      };
      posts.push(post);
      return post;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
