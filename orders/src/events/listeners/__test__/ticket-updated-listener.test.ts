import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@rabztix/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";


const setup = async () => {
    //Create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    
    //Create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20
    });
    await ticket.save();

    //Create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'Concert new',
        price: 100,
        userId: 'abc'
    }

    //Create a fake msg object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    //return all of this stuff
    return { msg, data, ticket, listener};
};

it('finds, updates and saves a ticket', async() => {
    const { msg, data, ticket, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the messsage', async () => {
    const { listener, data, msg } = await setup();

    //call the onMEssage function with the data object + message object
    await listener.onMessage(data, msg);

    //write assertions to make sure ACK functions is called
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack iof the event has a skipped version', async() => {
    const { listener, data, msg, ticket } = await setup();

    data.version = 10;

    try{
        await listener.onMessage(data, msg);
    } catch (err) {

    }
    

    expect(msg.ack).not.toHaveBeenCalled();

});