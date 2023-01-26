import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper'; //instance of NatsWrapper
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

const start = async () => {
    /* Catch error before the app loads and make sure the JWT token is defined */
    if(!process.env.JWT_KEY) {
        throw new Error('Secret key not defined');
    }
    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS cluster id is not defined');
    }

    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS client id is not defined');
    }

    if(!process.env.NATS_URL) {
        throw new Error('NATS URL is not defined');
    }


    if(!process.env.MONGO_URI) {
        throw new Error('Mongo URI is not defined');
    }

    try{
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();

        process.on('SIGINT', () =>  natsWrapper.client.close());
        process.on('SIGTERM', () =>  natsWrapper.client.close());
        await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('listening on port 3000!!');
    });
};

start();