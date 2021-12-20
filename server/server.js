const express = require('express');
// import Apollo Server
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schema');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');


const PORT = process.env.PORT || 3001;
const app = express();

// create a new Apollo and pass in the schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV) {
  app.use(express.static(path.resolve(process.cwd(), 'client/build')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'client/build/index.html'))
  })
}


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
