const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLObjectType,GraphQLID, GraphQLString, GraphQLSchema, GraphQLList } = require('graphql');
const mongoose = require('mongoose');

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        pageCount: { type: GraphQLString },
        author: { type: GraphQLString },
    }),
});

const schema = new GraphQLSchema({
    query: BookType,
});

//Base de donnée
//Schéma
const bookSchema = new mongoose.Schema({
    id: String,
    title: String,
    pageCount: Number,
    author: String
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

// Créer un modèle basé sur le schéma
const BookModel = mongoose.model('Book', bookSchema);

/*// Création d'un livre en utilisant le modèle
const newBook = new BookModel({
    id: "book-4",
    title: "Culpa mia",
    pageCount: 500,
    author: "Bive Zalae"
});*/

// Utiliser la promesse retournée par la méthode save pour gérer les erreurs
/*newBook.save()
    .then(book => {
        console.log('Livre ajouté à la base de données :', book);
    })
    .catch(error => {
        console.error('Erreur lors de l\'ajout du livre à la base de données :', error);
    });*/

//Mutations

// Définir une mutation GraphQL pour ajouter un livre
const AddBookMutation = {
    type: BookType,
    args: {
        id: {type: GraphQLString},
        title: { type: GraphQLString },
        pageCount: { type: GraphQLString },
        author: { type: GraphQLString },
    },
    resolve(parent, args) {
        const book = new BookModel(args);
        return book.save();
    },
};

// Définir une requête GraphQL pour récupérer tous les livres
const GetAllBooksQuery = {
    type: new GraphQLList(BookType),
    resolve() {
        return BookModel.find({});
    },
};

// Définir une requête GraphQL pour récupérer un livre par son ID
const GetBookByIdQuery = {
    type: BookType,
    args: { id: { type: GraphQLString } },
    resolve(parent, args) {
        return BookModel.findOne(args);
    },
};

// Requête GraphQL pour mettre à jour un livre
const UpdateBookMutation = {
    type: BookType,
    args: {
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        pageCount: { type: GraphQLString },
        author: { type: GraphQLString },
    },
    resolve(parent, args) {
        // Utilisez findOneAndUpdate pour mettre à jour le livre par son ID
        return BookModel.findOneAndUpdate(
            { id: args.id },
            { $set: { title: args.title, pageCount: args.pageCount, author: args.author } },
            { new: true } // Pour renvoyer le document mis à jour
        );
    },
};


//Requête GraphQL pour supprimer un livre par son titre
const DeleteBookMutation = {
    type: BookType,
    args: {
        id: { type: GraphQLString },
    },
    resolve(parent, args) {
        // Utilisez findOneAndDelete pour supprimer le livre par son ID
        return BookModel.findOneAndDelete({ id: args.id });
    },
};




// Ajouter les nouvelles requêtes et mutations à votre schéma
const schema1 = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            getAllBooks: GetAllBooksQuery,
            getBookById: GetBookByIdQuery,
        },
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            addBook: AddBookMutation,
            updateBook: UpdateBookMutation,
            deleteBook: DeleteBookMutation
        },
    }),

});

const app = express();
app.use('/api', graphqlHTTP({
    schema: schema1,
    graphiql: true,
}));
app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
