import { Publisher, OrderCancelledEvent, Subjects } from "@rabztix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
