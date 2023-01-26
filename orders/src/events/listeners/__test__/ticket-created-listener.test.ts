import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@rabztix/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    //create an instance of the listner
    const listner = new TicketCreatedListener(natsWrapper.client);

    //create a fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    //create a fake message objetct
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listner, data, msg }
}


it('creates and saves a ticket', async() => {
    const { listner, data, msg } = await setup();

    //call the onMEssage function with the data object + message object
    await listner.onMessage(data, msg);

    //write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});


it('acks the message', async() =>{
    const { listner, data, msg } = await setup();

    //call the onMEssage function with the data object + message object
    await listner.onMessage(data, msg);

    //write assertions to make sure ACK functions is called
    expect(msg.ack).toHaveBeenCalled();

});