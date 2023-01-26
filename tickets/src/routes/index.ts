import express, { Request, Response } from 'express';
import { Ticket } from '../models/tickets';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
    const ticket = await Ticket.find({
        orderid: undefined //filter out tickets already reserved
    });

    res.send(ticket);
});

export { router as indexTicketRouter }