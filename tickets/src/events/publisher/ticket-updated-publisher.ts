import { Publisher, Subjects, TicketUpdatedEvent } from "@rabztix/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}