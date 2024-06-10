import { Router } from 'express';
import CartsMongoManager from '../../daos/cartsManagerMongo.js';
import ProductsMongoManager from '../../daos/productsManagerMongo.js';

const router = Router();
const cartService = new CartsMongoManager;
const productService = new ProductsMongoManager;

router.post('/', async (req, res) => {
    try {
        const newCart = await cartService.addNewCart();
        res.status(201).send({ status: 'success', payload: newCart });
        
    } catch (error) {
        res.status(500).send({ status: 'error', error: error });
    }
});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cartFound = await cartService.getCartBy({_id: cid});
    try {
        if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });
        res.status(200).send({ status: 'success', payload: cartFound });
        
    } catch (error) {
        res.status(500).send({ status: 'error', error: error });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const cartFound = await cartService.getCartBy({_id: cid});
    try {
        if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });
        const product = await productService.getProductsById(pid);
    
        if (!product) {
            return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
        }
        let quantity = 1;
    
        await cartService.addProductToCart(cid, pid, parseInt(quantity));
        res.status(201).send({ status: 'success', payload: cartFound });
        
    } catch (error) {
        res.status(500).send({ status: 'error', error: error });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cartFound = await cartService.getCartBy({_id: cid});
        if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });
    
        const product = await productService.getProductsById(pid);
        if (!product) {
            return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
        }
        await cartService.updateProductFromCart(cid, pid, parseInt(quantity));
        res.status(201).send({ status: 'success', payload: cartFound });
        
    } catch (error) {
        res.status(500).send({ status: 'error', error: error });
    }
});

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const products = req.body;
    try {
        const cartFound = await cartService.getCartBy({_id: cid});
        if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });
    
        await cartService.updateCart(cid, products);
        res.status(201).send({ status: 'success', payload: cartFound });
        
    } catch (error) {
        res.status(500).send({ status: 'error', error: error });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cartFound = await cartService.getCartBy({_id: cid});
        if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });
    
        const productFound = await productService.getProductsById(pid);
        if (!productFound) {
            return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
        }
        await cartService.deleteProductFromCart(cid, pid);
        res.status(201).send({ status: 'success', payload: `El producto ${pid} ha sido eliminado del carrito ${cid}` });
        
    } catch (error) {
        res.status(500).send({ status: 'error', error: error });
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cartFound = await cartService.getCartBy({_id: cid});
    
        if (!cartFound) return res.status(400).send({ status: 'error', error: `¡Error! No existe el carrito` });
        res.status(200).send({ status: 'success', payload: cartFound });
        cartService.deleteCart(cid);
        
    } catch (error) {
        res.status(500).send({ status: 'error', error: error });
    }
});

export default router;