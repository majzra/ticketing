import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent} from "@rabztix/common";    
import { Ticket } from '../../models/ticket'; 
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName; //ensure the events is sent once to the group subscribe to Q

    //listens to this event so order service ipdateds its local ticket collection
    async onMessage(data: TicketCreatedEvent['data'], msg: Message  /*used for ACK */) {
        const { id, title, price } = data;
        const ticket = Ticket.build({
            id, title, price
        });
        await ticket.save();

        //send a message to the NATS server to let it konow the event has been processed successfully. OTherwise, NATS will wait for 30secs beforwe attempting to resend the message to the Q
        msg.ack();
    }
}