const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://u4okvb5zcpwmzsh:Y9QMSwyEqKDWgcPFmJ2G@blkumes3cneuqet-mongodb.services.clever-cloud.com:27017/blkumes3cneuqet';
 
// Database Name
const dbName = 'blkumes3cneuqet';
var client;

const get = function(collection){
    return new Promise(function(resolve, reject){
        if(client && client.isConnected()){
            db = client.db(dbName);
            resolve(db); 
        } else {
            // Use connect method to connect to the server
            MongoClient.connect(url, function(err, client) {
                assert.equal(null, err);
                //console.log("Connected successfully to server");
                db = client.db(dbName);
                resolve(db);     
            });
        }
    })
}

const close = function(){
    if(client && client.isConnected){
        client.close();
    }
}


module.exports = { get, close }