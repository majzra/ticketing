import { Listener, OrderCancelledEvent, Subjects  } from "@rabztix/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from './queue-group-name';
import { Order } from "../../../models/order";
import { OrderStatus } from "@rabztix/common";

export class OrderCancelledEventListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });

        if(!order) {
            throw new Error('Order Not Found');
        }

        order.set({ status: OrderStatus.Cancelled});
        await order.save();

        msg.ack();
    }
}