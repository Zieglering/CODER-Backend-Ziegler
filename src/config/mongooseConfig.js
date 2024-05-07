import { connect } from 'mongoose'


const connectMongoDB = () => {
    connect('mongodb://127.0.0.1:27017/ecommerce')
    console.log('Base de datos conectada')
}

export default connectMongoDB
