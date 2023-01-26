import request from 'supertest'; //supertest will allow us to fake request to our express server\
import { app } from '../../app';

it('returns 201 on successful sign up', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    });

        it('returns 400 with an invalid emailsign up', async () => {
            return request(app)
            .post('/api/users/signup')
            .send({
                email: 'testest.com',
                password: 'password'
            })
            .expect(400);
        });

        it('returns 400 with an invalid password', async () => {
            return request(app)
                .post('/api/users/signup')
                .send({
                    email: 'test@test.com',
                    password: 'pd'
                })
                .expect(400);
            });

        it('returns 400 with a missing email or passsword', async () => {
            await request(app)
            .post('/api/users/signup')
            .send({email: 'test@tes.com'})
            .expect(400);
            
            return request(app)
                .post('/api/users/signup')
                .send({password: 'passwordd'})
                .expect(400);
        });
        
it('disallows duplicate email', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201);

    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(400);
});

it('sets a cookie upon succesul sign up', async () => {
    const response = await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201);

    //the get method exists by default on the response
    expect(response.get('Set-Cookie')).toBeDefined();
});
        
