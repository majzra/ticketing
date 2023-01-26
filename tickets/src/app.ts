import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@rabztix/common';

import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';


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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

/*Express will capture this error and send it to our middleware
app.all takes into consideration the get, post and all the possible methods */
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app }