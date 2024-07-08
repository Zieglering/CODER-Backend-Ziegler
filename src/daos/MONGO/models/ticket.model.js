import { Schema, model } from 'mongoose';

const ticketSchema = new Schema({
    code: {
        type: String,
        default:'A',
        required: true,
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        default:0,
        required: true
    },
    // purchaser: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'users',
    //     required: true
    // }
    purchaser: {
        type: String,
        default:'mail',
        required: true,
    }

});

const ticketModel = model('tickets', ticketSchema);
export default ticketModel;