import express from 'express';
import ProductManager from './productManager.js';
const path = "./Products.json";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const { getProducts, addProduct, getProductsById, updateProduct, deleteProduct } = new ProductManager(path);

app.get('/api/products', async (req, res) => {
    const { limit } = req.query;
    const products = await getProducts();

    if (limit) {
        const limitedProducts = products.slice(0, parseInt(limit));
        return res.status(200).send({status:'success', payload:limitedProducts});
    }
    
    res.status(200).send({status:'success', payload:products});
});

app.post('/api/products', async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;
    const products = await getProducts()

    if(!title || !description || !price || !thumbnail || !code || !stock)
        return res.status(400).send({status:'error', error: 'faltan campos'});
    
    if (products.find((prod) => prod.code === code)) 
        return res.status(400).send({status:'error', error: `No se pudo agregar el producto con el código ${code} porque ya existe un producto con ese código`});

    const newProduct = await addProduct(title, description, price, thumbnail, code, stock);
    res.status(200).send({status:'success', payload:newProduct});
});
    

app.get('/api/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const productFound = await getProductsById(parseInt(pid));

    if(!productFound)
    return res.status(400).send({status:'error', error:`¡ERROR! No existe ningún producto con el id ${pid}`});
    
    res.status(200).send({status:'success', payload: productFound});
});

app.put('/api/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, price, thumbnail, code, stock } = req.body;
    const productFound = await getProductsById(parseInt(pid));

    if (!title || !description || !price || !thumbnail || !code || !stock) {
        return res.status(400).send({status:'error', error: 'faltan campos'});
    }
    
    if (!productFound) return res.status(400).send({status:'error', error: `No existe el producto con el id ${pid}`}); 
    
    const updatedProduct = await updateProduct(parseInt(pid), {title, description, price, thumbnail, code, stock});
    res.status(200).send({status:'success', payload:updatedProduct});
});

app.delete('/api/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const productFound = await getProductsById(parseInt(pid));

    if(!productFound) return res.status(400).send({status:'error', error:`¡ERROR! No existe ningún producto con el id ${pid}`});
    
    res.status(200).send({status:'success', payload: productFound});
    deleteProduct(parseInt(pid));

});

app.listen(8080, (error) => {
    if(error) return console.log(error);
    console.log('Server escuchando en el puerto 8080');
});