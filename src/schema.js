const { GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull
} = require("graphql")

const usersDao = require('./users/users.dao')
const messagesDao = require('./messages/messages.dao')


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
                console.log("/users resolver");
                return usersDao.getUsers()
            }
        },
        messages: {
            type: new GraphQLList(MessageType),
            resolve() {
                console.log("/messages resolver");
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
                console.log("/user:id resolver");
                usersDao.getById(id)
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: QueryType
});

exports.default = schema;