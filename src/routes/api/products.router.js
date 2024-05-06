import { Router } from 'express'
import ProductsMongoManager from '../../daos/productsMongo.manager.js';

const router = Router()
const productsManager = new ProductsMongoManager

router.get('/', async (req, res) => {
    try {
        const products = await productsManager.getProducts()
        res.status(200).send({ status: 'success', payload: products });
        
    } catch (error) {
        throw error
    }
});

router.post('/', async (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
    const products = await productsManager.getProducts()

    if(!title || !description || !code || !price || !stock || !category)
        return res.status(400).send({status:'error', error: 'faltan campos'});
    
    if (products.find((prod) => prod.code === code)) 
        return res.status(400).send({status:'error', error: `No se pudo agregar el producto con el código ${code} porque ya existe un producto con ese código`});

    const newProduct = await productsManager.addProduct(title, description, code, price, status, stock, category, thumbnails);
    res.status(201).send({status:'success', payload:newProduct});
});




router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const productFound = await productsManager.getProductsById(pid);

    if(!productFound)
    return res.status(400).send({status:'error', error:`¡ERROR! No existe ningún producto con el id ${pid}`});
    
    res.status(200).send({status:'success', payload: productFound});
});

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
    const productFound = await productsManager.getProductsById(pid);

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send({status:'error', error: 'faltan campos'});
    }
    
    if (!productFound) return res.status(400).send({status:'error', error: `No existe el producto con el id ${pid}`}); 
    
    const updatedProduct = await productsManager.updateProduct(pid, {title, description, code, price, status, stock, category, thumbnails});
    res.status(201).send({status:'success', payload:updatedProduct});
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    const productFound = await productsManager.getProductsById(pid);

    if(!productFound) return res.status(400).send({status:'error', error:`¡ERROR! No existe ningún producto con el id ${pid}`});
    
    res.status(200).send({status:'success', payload: productFound});
    productsManager.deleteProduct(pid);

});


export default router;

