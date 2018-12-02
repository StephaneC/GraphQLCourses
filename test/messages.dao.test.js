const assert = require( 'chai' ).assert;
const expect = require( 'chai' ).expect;
const done = require( 'chai' ).done;
const mongo = require('../src/mongo');

const messages = require('../src/messages/messages.dao')

describe( 'Messages dao', function() {

    it( `Get Message`, function() {
        return messages.getMessages()
        .then((msgs)=>{
            expect(msgs.length).equal(0);
        });
    });

    it( `Add messages + Get Messages`, function(done, fail) {
        messages.addMessage("dummy", {id: "IdUser"})
        .then((res)=>{
            messages.getMessages()
            .then((msgs)=>{
                expect(msgs.length).equal(1);
                done();
            }).catch(function(e){
                fail();
            });
        }).catch(function(e){
            fail();
        });
    });


    afterEach(function(){
        //clean db
        mongo.get().then(function(db){
            db.collection('MESSAGES').drop(function(err, delOK) {
                if (err) throw err;
                if (delOK) console.log("Collection MESSAGES deleted");
                mongo.close();
            });
        });
    });

});