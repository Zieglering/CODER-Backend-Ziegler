import express from 'express';

import { __dirname } from './utils.js'
import productsRouter from './routes/products.router.js'
import realtimeproductsRouter from './routes/realtimeproducts.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'


import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import ProductManager from './productManager.js';


const productsJsonPath = `${__dirname}/Products.json`;
const productManager = new ProductManager(productsJsonPath);




const app = express();
const PORT = process.env.PORT || 8080



const httpServer = app.listen(PORT, (error) => {
    if(error) return console.log(error);
    console.log('Server escuchando en el puerto 8080');
    
});

const io = new Server(httpServer)
 

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`))

app.engine('.handlebars', handlebars.engine())

app.set('views', `${__dirname}/views`)
app.set('view engine', '.handlebars')

app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/realtimeproducts', realtimeproductsRouter)
app.use('/api/carts', cartsRouter)


io.on('connection', async (socket) => {
    console.log('Cliente conectado');


    io.emit('getProducts', await productManager.getProducts()); 

    socket.on('addNewProduct', async (newProduct) => {
        try {

            const response = await fetch('http://localhost:8080/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            const responseData = await response.json();
            io.emit('newProductAdded', responseData);
            io.emit('getProducts', await productManager.getProducts());
        } catch (error) {
            console.error('Error', error);
            
        }
    });
    
    
    
});