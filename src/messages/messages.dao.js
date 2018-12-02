const mongo = require('../mongo');

const COLLECTION = 'MESSAGES';

const addMessage = function(message, user) {
    return new Promise(function(resolve, reject) {
        mongo.get().then(function(db){
            db.collection(COLLECTION).insertOne({
                message: message,
                user_id : user.id,
                date: new Date()
            }, function(err, result){
                if(!err){
                    resolve({});
                } else {
                    reject({
                        status: 500,
                        message: err
                    });
                }
            });
        }).catch(function(err){
            reject({
                status: 500,
                message: err
            });
        });
        /*messages.push({
            message: message,
            user_id : user.id,
            date: new Date()
        });*/
    });
}

const getMessages = function() {
    return new Promise(function(resolve, reject) {
        mongo.get().then(function(db){
            db.collection(COLLECTION).find({}).toArray(function(err, messages) {
                if(!err){
                    resolve(messages);
                } else {
                    reject({
                        status: 500,
                        message: err
                    });
                }
              });
        }).catch(function(err){
            reject({
                status: 500,
                message: err
            });
        });
    });
}

module.exports = { addMessage, getMessages };