import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', { //<Payload> tells the data type of the queue
    redis: {
        host: process.env.REDIS_HOST

    }
});

expirationQueue.process(async (job) => { // job is an object that wraps up our data
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    })
    console.log('I want to publish an expiration for ordrId', job.data.orderId);
});

export { expirationQueue };