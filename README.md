# graphql_Nodejs

## Données de test MongoDB

Le fichier `books.json` dans le dossier `mongodb/graphql` contient des données qui sont utilisées pour initialiser la collection (ou table) associée à notre projet graphql_Nodejs. Ces données de test sont utilisées pour vérifier et tester les fonctionnalités créées.

### Utilisation

1. Assurez-vous que votre base de données MongoDB est en cours d'exécution.
2. Importez les données du fichier `books.json` dans la collection associée en utilisant la commande suivante :

    ```bash
    mongoimport --db <nom-de-la-base-de-donnees> --collection <nom-de-la-collection> --file mongodb/graphql/books.json --jsonArray
    ```

   Assurez-vous de remplacer `<nom-de-la-base-de-donnees>` et `<nom-de-la-collection>` par les noms appropriés de votre base de données et de votre collection.

3. Les données sont maintenant disponibles dans la base de données, prêtes à être utilisées pour tester les différentes fonctionnalités du projet.

### Sur Postman
l'URL : http://localhost:4000/api

Nous avons les parties :
- Query
- Mutation

#### Dans Query :
- getAllBooks()
````
query GetAllBooks {
    getAllBooks {
        id
        title
        pageCount
        author
    }
}
````
- getBookById()
````
query GetBookById {
    getBookById(id: "book-2") {
        id
        title
        pageCount
        author
    }
}
````
#### Mutation
- addBook
````
mutation AddBook {
    addBook(id: "book-4", title: "Porsche", pageCount: "800", author: "Inès") {
        id
        title
        pageCount
        author
    }
}
````
- updateBook
````
mutation UpdateBook {
    updateBook(id: "book-4", title: "BMW", pageCount: "800", author: "Inès") {
        id
        title
        pageCount
        author
    }
}
````
- deleteBook
````
mutation DeleteBook {
    deleteBook(id: "book-4") {
        id
        title
        pageCount
        author
    }
}
````