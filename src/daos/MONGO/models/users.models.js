import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const userCollection = 'users';

const userSchema = new Schema({
    fullName: {
        type: String,
    },
    first_name: {
        type: String
    },
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    age: Number,
    password: String,
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        emum: ['user', 'premium', 'admin'],
        default: 'user'
    },
    documents: [{
        name: String,
        reference: String,
    }],
    last_connection: String
});

userSchema.plugin(mongoosePaginate);

export const userModel = model(userCollection, userSchema);