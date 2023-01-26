import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent} from "@rabztix/common";    
import { Ticket } from '../../models/ticket'; 
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName; //ensure the events is sent once to the group subscribe to Q

    //listens to this event so order service ipdateds its local ticket collection
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message  /*used for ACK */) {
        const ticket = await Ticket.findByEvent(data);
        
        if(!ticket) {
            throw new Error('Ticket not found');
        }

        const { title, price } = data;
        ticket.set({ title, price });
        await ticket.save();
    
        msg.ack();
    }
}