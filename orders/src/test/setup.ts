import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";  
import jwt from 'jsonwebtoken';

jest.mock('../nats-wrapper');

//mongo needs to be accessed from both beforeAll and afterAll
//that is why we are declaring it here/
let mongo : any;

//the beforeAll will run first before anything is executed
beforeAll( async () => {
    jest.clearAllMocks();
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

//helper function to ease the sign up process
declare global {
    var signin: () => string[];
}

global.signin = () => {
    //Build a JWT token payload. { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(), //generate an id using mongoose, //any id works
        email: 'test@test.com' //any email
    };

    //create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!)

    //Build session Object . { jwt: MY_JWT}
    const session = { jwt: token };

    //Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    //Take JSON and encode it as a based64
    const base64= Buffer.from(sessionJSON).toString('base64');

    //return a string that is the cookie with the encoded data
    return [`session=${base64}`];
};

