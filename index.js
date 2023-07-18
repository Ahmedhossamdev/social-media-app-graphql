require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const { startStandaloneServer } = require('@apollo/server/standalone');


const typeDefs = require('./server/graphql/typeDefs');
const { connectDB } = require('./server/config/db.js');
const resolvers = require('./server/graphql/resolvers');


async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({ req }),
    });

    const { url } = await server.listen({ port: 3000 });

    console.log(`🚀 Server ready at: ${url}`);
}

connectDB();
startServer();