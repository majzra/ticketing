import mongoose from "mongoose";
import { OrderStatus } from '@rabztix/common';
import { TicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { OrderStatus };

interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc; //reference to a ticket
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs) : OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expireAt: {
        type: mongoose.Schema.Types.Date //not required since expiration is not necessary once a user buys a ticket
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket' //reference to a ticket
    }
    } , {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    });

    orderSchema.set('versionKey', 'version');
    orderSchema.plugin(updateIfCurrentPlugin);

    orderSchema.statics.build = (attrs: OrderAttrs) => {
        return new Order(attrs);
    };

    const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

    export { Order }