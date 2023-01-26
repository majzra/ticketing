import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper'; // Jest will import the fake wrapper
import { Ticket } from '../../models/tickets';

it('return a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString(); //generate an id using mongoose
    await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
        title: 'test',
        price: 20
    })
    .expect(404)
});

it('return a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString(); //generate an id using mongoose
    await request(app)
    .put(`/api/tickets/${id}`)
    .send({
        title: 'test',
        price: 20
    })
    .expect(401)
});

it('return a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'testing',
        price: 10
    });

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
        title: 'testing',
        price: 10
    })
    .expect(401);
});

it('return a 400 if the user provides an invalid title and price', async () => {
    const cookie = global.signin();

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'testing',
        price: 10
    });

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: '',
        price: 10
    })
    .expect(400);

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'test',
        price: -10
    })
    .expect(400);

});

it('return a 200 if all is good', async () => {
    const cookie = global.signin();

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'testing',
        price: 10
    });

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'new test',
        price: 100
    })
    .expect(200);

    const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

    expect(ticketResponse.body.title).toEqual('new test');
    expect(ticketResponse.body.price).toEqual(100);

});

it('publishes an event', async () => {
    const cookie = global.signin();

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'testing',
        price: 10
    });

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'new test',
        price: 100
    })
    .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled(); //ensure the function publish is called
});

it('rejects updates if the ticket is reserved', async() => {
    const cookie = global.signin();

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'testing',
        price: 10
    });

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({orderId: new mongoose.Types.ObjectId().toHexString()});
    await ticket!.save();

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'new test',
        price: 100
    })
    .expect(400);
});

