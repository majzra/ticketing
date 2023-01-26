import { natsWrapper } from './nats-wrapper'; //instance of NatsWrapper
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
    /* Catch error before the app loads and make sure the JWT token is defined */
    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS cluster id is not defined');
    }

    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS client id is not defined');
    }

    if(!process.env.NATS_URL) {
        throw new Error('NATS URL is not defined');
    }


    try{
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });

        process.on('SIGINT', () =>  natsWrapper.client.close());
        process.on('SIGTERM', () =>  natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();

    } catch (err) {
        console.log(err);
    }

};

start();