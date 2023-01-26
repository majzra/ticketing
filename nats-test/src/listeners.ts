import nats from 'node-nats-streaming'; // Message contain the typedefinition for the message property in MATS
import { randomBytes }  from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear(); //clear the console

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222' //we setup a port forwarding to connect to NATS server inside K8s.ubectl port-forward nats-depl-6d7c59468f-dlndk 4222:4222
}); //client we can use to connect to the nats streaming server

//once stan is connected to the server, we continue. This is an event based approach
//since async/await do bot work for nats
stan.on('connect', () => {
    console.log('Listener connected to NATS');

    //used to notify theNATS server that is listener is going to be shutdown so it removes it from the listener list
    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });

    new TicketCreatedListener(stan).listen();
});

//ways to kill the listener
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());








/*
const options = stan.subscriptionOptions()
    .setManualAckMode(true) //sets the manual ack true, the NATS is no longer ak the message
    .setDeliverAllAvailable() //ensure all events are delivered when a service starts up. USed only when a new service is launched. Ignored upon restart
    .setDurableName('acoounting-srv'); // ensure only the event that haven't been processed are deleivered for the servoce.
    //the orders-service-queue-group is there to ensure that listeners subscribed to this queue receive the message once
    const subscription = stan.subscribe('ticket:created', 'orders-service-queue-group', options); //subscripbe to the ticket created channel

    //call back function upon receiving a message
    subscription.on('message', (msg: Message) => {
        console.log('Message received');
        const data = msg.getData();

        if(typeof data === 'string') {
            //data will be received as a JSON. We need to parse it.
            console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
        }

        msg.ack(); // aknowledge the message has been received and processed correctvly. If not ACK, the NATS server will wait for 30secs before retrying to send the event.
    });
*/