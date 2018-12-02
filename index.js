const express = require("express")
const bodyParser = require("body-parser")
const graphqlHTTP = require("express-graphql")
//const schema = require("./src/schema")
const usersDao = require('./src/users/users.dao')
const messagesDao = require('./src/messages/messages.dao')

const { GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} = require("graphql")


const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
      id: {
          type: GraphQLString
      },
      username: {
          type: GraphQLString
      },
      urlPhoto: {
          type: GraphQLString
      },
      date: {
          type: GraphQLString
      }
  }
});

const MessageType = new GraphQLObjectType({
  name: 'MessageType',
  fields: {
      id: {
          type: GraphQLString
      },
      message: {
          type: GraphQLString
      },
      date: {
          type: GraphQLString
      },
      user: {
          type: UserType,
          resolve(message) {
              usersDao.getById(message.userId)
          }
      }
  }
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
      users: {
          type: new GraphQLList(UserType),
          resolve() {
              return usersDao.getUsers()
          }
      },
      messages: {
          type: new GraphQLList(MessageType),
          resolve() {
              return messagesDao.getMessages()
          }
      },
      user: {
          type: UserType,
          args: {
              id: {
                  type: new GraphQLNonNull(GraphQLID)
              }
          },
          resolve(parent, { id }) {
              usersDao.getById(id)
          }
      }
  }
});

const schema = new GraphQLSchema({
  query: QueryType
});






var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
