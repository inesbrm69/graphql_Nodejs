const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = require('graphql');
const mongoose = require('mongoose');

const QueryRoot = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        hello: {
            type: GraphQLString,
            resolve: () => 'Hello world!',
        },
    }),
});

const schema = new GraphQLSchema({ query: QueryRoot });

const app = express();
app.use('/api', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));
app.listen(4000, () => {
    console.log('Server is running on port 4000');
});

// URL de connexion à la base de données MongoDB
const mongoDBURL = 'mongodb://localhost:27017/graphql';

// Établir une connexion à MongoDB
mongoose.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });

// Gérer les événements de connexion
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
db.once('open', () => {
    console.log('Connecté à la base de données MongoDB');
});
