import request from 'supertest'; //supertest will allow us to fake request to our express server\
import { app } from '../../app';

it('clears the cookies after signing out', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});