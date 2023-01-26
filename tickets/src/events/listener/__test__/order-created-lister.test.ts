import { OrderCreatedListener } from "../order-created-lister";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/tickets";
import { OrderCreatedEvent, OrderStatus } from "@rabztix/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    //create an instance of the lister
    const listener = new OrderCreatedListener(natsWrapper.client);

    //create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        userId: 'randomuser',
    })
    await ticket.save();


    //create a fake event data
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'randomId',
        expiresAt: 'faketimestamp',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {listener, ticket, data, msg}
};

it('sets the orderid of the ticket', async() => {
    const {listener, ticket, data, msg} = await setup();


    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);

});

it('acks the message', async() => {
    const {listener, ticket, data, msg} = await setup();
    
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();

});

it('publishes a ticket updated event', async() => {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});