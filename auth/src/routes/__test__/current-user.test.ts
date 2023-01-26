import request from 'supertest'; //supertest will allow us to fake request to our express server\
import { app } from '../../app';

it('responds with details about the current user', async() => {
    const cookie = await global.signin();

    const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie) //used to set different headers in the request
    .send()
    .expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authentocated', async() => {
    const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

    expect(response.body.currentUser).toEqual(null);
});