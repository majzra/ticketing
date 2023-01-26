import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError, validateRequest } from '@rabztix/common';
import { User } from '../models/user';

const router = express();

router.post('/api/users/signup', [
    body('email')
    .isEmail()
    .withMessage('Email must be valid'),
    body('password')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage('Password must be between 4 and 20 characters')
],
//validate the request for errors using the helper middleware.
validateRequest,
async (req: Request , res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if(existingUser) {
        throw new BadRequestError('Email is in use');
    }

    const user = User.build({email, password});
    //save the user in the database
    await user.save();

    //Generate json web token
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY! //JWT_KEY! typescript is not aware we put in check at the begining, we put the ! to tell typecript that this variable is 100% defined 
    );

    //store jwt on session object
    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user);


});

export { router as signupRouter };