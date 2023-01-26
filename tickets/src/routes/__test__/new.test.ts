import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/tickets';
import { natsWrapper } from '../../nats-wrapper'; // Jest will import the fake wrapper


it('has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .send({});

    expect(response.status).toEqual(401);
});

it('returns a ststus other than  401 if user is signed in', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: '',
        price: 10
    }).expect(400);

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        price: 10,
    }).expect(400);

});

it('returns an error if an invalid price is provided', async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'test',
        price: -10,
    }).expect(400);

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin()) // create a fake cookie to ensure the request is authenticated
    .send({
        title: 'test title'
    }).expect(400);
});

it('creates a ticket with valid parameters', async () => {
    let tickets = await Ticket.find({}); // get all the tickets inside the collection
    expect(tickets.length).toEqual(0);

    const title = 'test';

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title,
        price: 10,
    }).expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(10);
    expect(tickets[0].title).toEqual(title);
});

it('publishes an event', async () => {
    const title = 'test';

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title,
        price: 10,
    }).expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled(); //ensure the function publish is called
});