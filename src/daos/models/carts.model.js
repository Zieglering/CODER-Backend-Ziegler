import { Schema, model } from 'mongoose'

const cartsSchema = new Schema({
    id: Number,
    products: [{
        product: Number,
        quantity: Number
    }]
})

const cartsModel = model('carts', cartsSchema)

export default cartsModel
