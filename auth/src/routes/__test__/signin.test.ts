import request from 'supertest'; //supertest will allow us to fake request to our express server\
import { app } from '../../app';

it('fails when a emaol does not exist is supplied', async () => {
    await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async() => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@test.com',
        password: 'passwrd'
    })
    .expect(400);
});

it('responds with a cookie when it is given a valid credentials', async() => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    const response = await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();

});

