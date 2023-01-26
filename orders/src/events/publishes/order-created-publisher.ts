import { Publisher, OrderCreatedEvent, Subjects } from "@rabztix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
