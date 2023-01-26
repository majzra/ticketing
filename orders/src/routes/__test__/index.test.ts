import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

//helper function to create tickets
const buildTicket = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });

    await ticket.save();

    return ticket;
}

it('fetches orders for a particular user', async () => {
    //create three tickets
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = global.signin();
    const userTwo = global.signin();
    //create one order as User #1
    await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id})
    .expect(201);

    //create two orders as User # 2
    const { body: OrderOne } = await request(app) //destructuring the response we are getting from request and savoing it into the body and then renamoning body  ti ORderOne
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id})
    .expect(201);
    const { body: OrderTwo } =  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id})
    .expect(201);

    // Make request to get orders for User #2
    const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

    //Make sure we only got the orders for User #2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(OrderOne.id);
    expect(response.body[1].id).toEqual(OrderTwo.id);

});