import { Message, Stan } from 'node-nats-streaming'; // Message contain the typedefinition for the message property in MATS
import { Subjects } from './subjects';

interface Event {
    subject: Subjects;
    data: any;
}

//ehenever we try to use Listener, we have to use some custom type to it.
//we are using to TypeScript to make sure the data provided for the event foields is correct
export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message) : void;
    private client: Stan;
    protected ackWait = 5 * 1000;

    constructor(client : Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client.subscriptionOptions()
        .setManualAckMode(true) //sets the manual ack true, the NATS is no longer ak the message
        .setDeliverAllAvailable() //ensure all events are delivered when a service starts up. USed only when a new service is launched. Ignored upon restart
        .setAckWait(this.ackWait)
        .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

            subscription.on('message', (msg : Message) => {
                console.log(`
                    Message received: ${this.subject} / ${this.queueGroupName}`)

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string'
        ? JSON.parse(data) // parsing a string
        : JSON.parse(data.toString('utf8')); // parsing a buffer
    }
}