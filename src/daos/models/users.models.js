import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const userCollection = 'users';

const userSchema = new Schema({
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
        emum: ['user', 'premium-user', 'admin'],
        default: 'user'
    }
});

userSchema.plugin(mongoosePaginate);

export const userModel = model(userCollection, userSchema);