import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest, BadRequestError } from '@rabztix/common';
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express();

router.post('/api/users/signin', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a pawword')
],
//validate the request for errors using the helper middleware.
validateRequest,
//the Request and Response types are defined inside the express package.
async (req : Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    
    if(!existingUser) {
        throw new BadRequestError('Invalid Credentials');
    }

    const passwordsMatch = await Password.compare(existingUser.password, password);
    if (!passwordsMatch) {
        throw new BadRequestError('Invalid Credentials');
    }

    //Generate json web token
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY! //JWT_KEY! typescript is not aware we put in check at the begining, we put the ! to tell typecript that this variable is 100% defined 
    );

    //store jwt on session object
    req.session = {
        jwt: userJwt
    };
    //200 code -- we are not creating a record.
    res.status(200).send(existingUser);
});

export { router as signinRouter };