import { Message } from 'node-nats-streaming'; // Message contain the typedefinition for the message property in MATS
import { Listener } from './base-listener';
import { TicketCreatedEvent } from './tickets-created-event';
import { Subjects } from './subjects';

//Ensure the right event name and data type are present in the event itself. Eliminate Typos
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    //ensure subject is what is defined in the TicketCreatedEvent
    readonly subject: Subjects.TicketCreated =  Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage( data: TicketCreatedEvent['data'], msg: Message ) {
        console.log('Event data!', data);

        msg.ack(); //message succesfully parsed.
    }
}