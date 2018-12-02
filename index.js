const express = require("express")
const bodyParser = require("body-parser")
const graphqlHTTP = require("express-graphql")
const schema = require("./src/schema").default

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
