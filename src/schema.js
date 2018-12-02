const { GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull
} = require("graphql")

const usersDao = require('./users/users.dao')
const messagesDao = require('./messages/messages.dao')


const TokenType = new GraphQLObjectType({
    name: 'TokenType',
    fields: {
        token: {
            type: GraphQLString
        }
    }
});

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
                return usersDao.getById(id)
            }
        }
    }
});

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {       
        signup: {
            type: UserType,
            args: {
                username: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                password: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                urlPhoto: {
                    type: GraphQLString
                }
            },
            resolve(parent, { username, password, urlPhoto }) {
                console.log("/signup resolver");
                return usersDao.signup(username, password, urlPhoto)
            }
        },
        signin: {
            type: TokenType,
            args: {
                username: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                password: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve(parent, { username, password }) {
                console.log("/signin resolver");
                return usersDao.signin(username, password)
            }
        },
        addMessage: {
            type: UserType,
            args: {
                message: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve(parent, { message }) {
                console.log("/addmessage resolver");
                return messagesDao.addMessage(message)
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
});

exports.default = schema;