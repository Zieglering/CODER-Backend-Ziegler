import express from 'express';

import { __dirname } from './utils.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'


import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import ProductManager from './productManager.js';


const productsJsonPath = `${__dirname}/Products.json`;
const productManager = new ProductManager(productsJsonPath);
const getProducts = productManager.getProducts()
const addProduct = async (newProduct) => {
    await productManager.addProduct(newProduct);

}


const app = express();
const PORT = process.env.PORT || 8080


const httpServer = app.listen(PORT, (error) => {
    if(error) return console.log(error);
    console.log('Server escuchando en el puerto 8080');
    
});

const io = new Server(httpServer)
 




//middleware
function productsSocket(io){
return(req, res, next) => {
    req.io = io
    next()
}
}
productsSocket(io)


app.use(productsSocket(io))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`))

app.engine('.handlebars', handlebars.engine())

app.set('views', `${__dirname}/views`)
app.set('view engine', '.handlebars')

app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)



io.on('connection', async socket => {
    console.log('Conectado');

    io.emit('server:listProducts', await getProducts);
    
        socket.on('client:newProduct', async (newProduct) => {
            await addProduct(newProduct);
            
            io.emit('server:newProduct', newProduct);
        });
    });
    





// app.post('/api/products', async (req, res) => {
//     const newProduct = req.body;
    
//     await addProduct(newProduct);
    
//     io.emit('server:newProduct', newProduct);
    
//     res.status(201).send({ status: 'success', payload: newProduct });
// });