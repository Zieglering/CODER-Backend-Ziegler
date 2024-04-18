import { Router } from 'express'
import { __dirname } from '../utils.js'
import ProductManager from '../productManager.js';


const productsJsonPath = `${__dirname}/Products.json`;

const router = Router()

const { getProducts, addProduct, getProductsById, updateProduct, deleteProduct } = new ProductManager(productsJsonPath);

router.get('/', async (req, res) => {
    const { limit } = req.query;
    const products = await getProducts();

    if (limit) {
        const limitedProducts = products.slice(0, parseInt(limit));
        return res.status(200).send({status:'success', payload:limitedProducts});
    }
    
    res.status(200).send({status:'success', payload:products});
});

router.post('/', async (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
    const products = await getProducts()

    if(!title || !description || !code || !price || !stock || !category)
        return res.status(400).send({status:'error', error: 'faltan campos'});
    
    if (products.find((prod) => prod.code === code)) 
        return res.status(400).send({status:'error', error: `No se pudo agregar el producto con el código ${code} porque ya existe un producto con ese código`});

    const newProduct = await addProduct(title, description, code, price, status, stock, category, thumbnails);
    // io.emit('productAdded', newProduct);
    res.status(201).send({status:'success', payload:newProduct});
});




router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const productFound = await getProductsById(parseInt(pid));

    if(!productFound)
    return res.status(400).send({status:'error', error:`¡ERROR! No existe ningún producto con el id ${pid}`});
    
    res.status(200).send({status:'success', payload: productFound});
});

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
    const productFound = await getProductsById(parseInt(pid));

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send({status:'error', error: 'faltan campos'});
    }
    
    if (!productFound) return res.status(400).send({status:'error', error: `No existe el producto con el id ${pid}`}); 
    
    const updatedProduct = await updateProduct(parseInt(pid), {title, description, code, price, status, stock, category, thumbnails});
    res.status(201).send({status:'success', payload:updatedProduct});
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    const productFound = await getProductsById(parseInt(pid));

    if(!productFound) return res.status(400).send({status:'error', error:`¡ERROR! No existe ningún producto con el id ${pid}`});
    
    res.status(200).send({status:'success', payload: productFound});
    deleteProduct(parseInt(pid));

});


export default router;