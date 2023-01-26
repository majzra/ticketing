import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear(); //clear the console

// the second argument is the client id abc
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222' //we setup a port forwarding to connect to NATS server inside K8s.ubectl port-forward nats-depl-6d7c59468f-dlndk 4222:4222
}); //client we can use to connect to the nats streaming server


//once stan is connected to the server, we continue. This is an event based approach
//since async/await do bot work for nats
stan.on('connect', async () => {
    const publisher = new TicketCreatedPublisher(stan);
    console.log('Publisher connected to NATS');

    try {
        await publisher.publish({
            id: '1000',
            title: 'CONCERRT',
            price: 100
        });
    } catch (error) {
        console.log(error);
    }
});