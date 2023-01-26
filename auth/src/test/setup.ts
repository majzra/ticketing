import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";  
import request from 'supertest'; //supertest will allow us to fake request to our express server\
import { app } from '../app';

//mongo needs to be accessed from both beforeAll and afterAll
//that is why we are declaring it here/
let mongo : any;

//the beforeAll will run first before anything is executed
beforeAll( async () => {
    process.env.JWT_KEY = 'asddd';
    const mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

// Will be run before EACH test
beforeEach(async () => {
    //Get all collections that exist in memory and delete them
    //This will ensure data is being destroyed after each test
    const collections = await mongoose.connection.db.collections();

    for ( let collection of collections ) {
        await collection.deleteMany({});
    }

});

//delete connection and reset everythiong once all the tests are done
//stop mongomermeoryserver and twll mongoose to disconnect from it
afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

//helper function to ease the sign up process.
//The function below will be used as a helper for all test case scenarios defined in routes/__tests__
declare global {
    var signin: () => Promise<string[]>;
}

global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
    .post('/api/users/signup')
    .send({email, password})
    .expect(201);

    const cookie = response.get('Set-Cookie');
    return cookie;
};

