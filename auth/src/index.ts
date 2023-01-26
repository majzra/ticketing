import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    console.log('starting up!');
    /* Catch error before the app loads and make sure the JWT token is defined */
    if(!process.env.JWT_KEY) {
        throw new Error('Secret key not defined');
    }
    if(!process.env.MONGO_URI) {
        throw new Error('Mongo URI is not defined');
    }

    try{
        await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('listening on port 3000!!');
    });
};

start();