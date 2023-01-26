import { Subjects } from "./subjects";

//define the data associated with TicketCreatedEvent.
export interface TicketCreatedEvent {
    subject: Subjects.TicketCreated;
    data: {
        id: string;
        title: string;
        price: number;
    };
}