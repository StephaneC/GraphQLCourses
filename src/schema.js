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

module.export = { schema }