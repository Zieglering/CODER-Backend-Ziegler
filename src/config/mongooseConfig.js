import { connect } from 'mongoose'


const connectMongoDB = () => {
    // connect to localhost
    // connect('mongodb://127.0.0.1:27017/ecommerce')
    connect('mongodb+srv://zieglering:bX5FNTpfWgkHOvE0@cluster0.vxpuioi.mongodb.net/ecommerce')
    console.log('Base de datos conectada')
}


export default connectMongoDB
