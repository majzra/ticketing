import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError, BadRequestError } from '@rabztix/common';
import { Ticket } from '../models/tickets';
import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
    body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
    body('price')
    .isFloat({gt: 0})
    .withMessage('Invalid ticket price')
], validateRequest, 
async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket) {
        throw new NotFoundError();
    }

    if(ticket.orderId) {
        throw new BadRequestError('Cannot edit a reserved ticket');
    }

    if(ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    //update record in mongo
    ticket.set({
        title: req.body.title,
        price: req.body.price
    });

    //save record in db persistently
    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title, //use title and price in ticket as they are sanitized
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    });


    res.send(ticket);
});

export { router as updateTicketRouter }