import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@rabztix/common';

import { deleteOrderRouter } from './routes/delete';   
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        //cookies are only shared when a user makes a connection over https
        //NODE_ENV is set by JEST. If NODE_ENV is test then secure is false. Otherwise it is true
        secure: process.env.NODE_ENV !== 'test'
    })
);
app.use(currentUser);
app.use(deleteOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);

/*Express will capture this error and send it to our middleware
app.all takes into consideration the get, post and all the possible methods */
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app }