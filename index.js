const connectDB = require('./server/config/db.js');
const express = require("express");
const {createServer} = require('http');
const {makeExecutableSchema} = require("@graphql-tools/schema");
const {SubscriptionServer} = require("subscriptions-transport-ws");
const {execute, subscribe} = require("graphql");
const {ApolloServer} = require("apollo-server-express");
const typeDefs = require("./server/graphql/typeDefs.js");
const resolvers = require("./server/graphql/resolvers");




(async function () {
    const app = express();

    const httpServer = createServer(app);

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

    const subsciptionServer = SubscriptionServer.create(
        {schema, execute, subscribe},
        {server: httpServer, path: '/graphql'}
    )

    const server = new ApolloServer({
        schema,
        context: ({req}) => ({req}),
        plugins:[
            {
                async serverWillStart(){
                    return{
                        async drainServer(){
                            subsciptionServer.close();
                        }
                    };
                }
            }
        ]
    });
    await server.start();
    server.applyMiddleware({app});
    connectDB();

    const PORT = 3000;
    httpServer.listen(PORT , () =>{
        console.log("Server is now running on port: 🚀🚀 " + PORT);
    });

})();