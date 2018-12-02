const expect = require('chai').expect;

const mongo = require('../src/mongo');
const users = require('../src/users/users.dao')

describe('Users dao', function () {

    it(`Signup No User `, function () {
        return users.signup("dummy", "dummy", "url")
            .then((user) => {
                console.log("Signup User Ok");
                console.log({ user });
                expect(user).to.have.property('id');
            }).catch(function (e) {
                console.log({ e });
                expect(0).equal(1);
            });
    });

    it(`getById `, function (done, fail) {
        users.signup("dummyId", "dummy", "url")
            .then((user) => {
                console.log("Looking for user " + user.id);
                users.getById(user.id)
                .then(function(u){
                    console.log("Get User by Id " + u);
                    expect(u.username).to.equal('dummyId');
                    done();
                });
            }).catch(function (e) {
                console.log({ e });
                fail();
            });
    });

    it(`get users `, function (done, fail) {
        console.log("getUsers");
        users.signup("dummyAll", "dummy", "url")
            .then((user) => {
                users.getUsers()
                .then(function(u){
                    expect(u.length).to.equal(1);
                    done();
                });
            }).catch(function (e) {
                console.log({ e });
                fail();
            });
    });

    it(`Signup User already exist `, function () {
        return users.signup("azert", "dummy", "url")
            .then((user) => {
                console.log({ user });
                expect(user).to.have.property('id');
                users.signup("azert", "dummy", "url")
                    .catch((res) => {
                        expect(res).to.have.property('status');
                        expect(res.status).to.equal(401);

                    });
            });
    });

    it(`Signin User exist `, function () {
        return users.signup("dum", "dummy", "url")
            .then((user) => {
                console.log({ user });
                expect(user).to.have.property('id');
                users.signin("dum", "dummy")
                    .then((res) => {
                        expect(res).to.have.property('token');
                    });
            });
    });

    it(`Signin User exist Wrong pwd`, function (done, fail) {
        users.signup("dummy3", "dummy3", "url")
            .then((user) => {
                console.log({ user });
                expect(user).to.have.property('id');
                users.signin("dummy3", "dummy4")
                    .then((res) => {
                        console.log("Signin ok should not");
                        fail();
                    }).catch(function(e){
                        expect(e).to.have.property('status');
                        expect(e.status).to.equal(401); 
                        done();       
                    });
            });
    });

    it(`Signin User not exist `, function (done, fail) {
        users.signin("dummy12", "dummy12")
            .then(function () {
                console.log("Error user should not exist")
                fail();
            })
            .catch((res) => {
                console.log("Error signin user not exist");
                console.log({ res });
                expect(res).to.have.property('status');
                expect(res.status).to.equal(401);
                done();
            });
    });

    afterEach(function (done) {
        //clean db
        mongo.get().then(function (db) {
            try {
                db.collection('USERS').drop()
                .then(function () {
                    // success
                    console.log("Dropped USERS collection");
                    done();
                }).catch(function (e) {
                    // error handling
                    console.log("ERROR Dropping USERS collection" + e);
                    done();
                })

            } catch (e) {
                console.log(e);
                done();
            }
        }).catch(function(e){
            console.log(e);
            done();
        });
    });

});