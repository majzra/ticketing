import { Publisher, Subjects, TicketCreatedEvent } from "@rabztix/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}