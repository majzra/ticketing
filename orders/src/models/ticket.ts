import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus  } from "./order";

interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved() : Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs) : TicketDoc;
    findByEvent(event: {id: string, version: number}): Promise<TicketDoc | null>; // either return a ticket or nothing
}

const ticketSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    } } , {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    });

    ticketSchema.set('versionKey', 'version');
    ticketSchema.plugin(updateIfCurrentPlugin);

    ticketSchema.statics.findByEvent = (event: {id: string, version: number}) => {
        return  Ticket.findOne({
            _id: event.id,
            version: event.version - 1 // find the record with version = current version -1
        });
    };
    
    //add new methods to a model
    ticketSchema.statics.build = (attrs: TicketAttrs) => {
        return new Ticket({
            _id: attrs.id, //we need to deconstruct this way because mongoose only uses _id as id of a record. IF it doesn't find it, it will create a new one
            title: attrs.title,
            price: attrs.price
        });
    };

    //add new method to a doc
    ticketSchema.methods.isReserved = async function () { //don't use the arrow function, otherwise it is going to mess up the this propperty
        //this === the ticket document that we just called isRederved om
        const existingOrder = await Order.findOne({
            ticket: this,
            status: {
                $in: [
                    OrderStatus.Created,
                    OrderStatus.AwaitingPayment,
                    OrderStatus.Complete
                ]
            }
        });

        return !!existingOrder; //if exisiting order is null, the first ! will turn it to false and the secnd one to TRUE
    }

    const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

    export { Ticket }