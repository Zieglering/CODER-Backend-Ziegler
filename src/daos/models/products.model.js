import { Schema, model } from 'mongoose'


const productsSchema = new Schema({
    id: Number,
    title: String,
    description: String,
    code: {
        type: String,
        required:true,
        unique: true
    },
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: String
})

const productsModel = model('Product', productsSchema)

export default productsModel