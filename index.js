require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');


const typeDefs = require('./server/graphql/typeDefs');
const { connectDB } = require('./server/config/db.js');
const resolvers = require('./server/graphql/resolvers');

connectDB();


async function startServer() {
    connectDB();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 3000 },
    });

    console.log(`🚀 Server ready at: ${url}`);
}

startServer();