import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@rabztix/common';
import { Ticket } from '../models/tickets';
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

//Middlewears requireAuth is  placed in post
//Order of the middlewares matters. We checked the user is logged in first 
//before checking for valid title and price
router.post('/api/tickets', requireAuth, [
    body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
    body('price')
    .isFloat({gt: 0})
    .withMessage('Price must be greater than 0')
], validateRequest,
async ( req: Request, res: Response ) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    });
    await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title, //use title and price in ticket as they are sanitized
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    });

    res.status(201).send(ticket);
})

export { router as createTicketRouter }