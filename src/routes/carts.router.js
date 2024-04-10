import { Router } from 'express'
import { __dirname } from '../utils.js'
import CartManager from '../cartManager.js';
import ProductManager from '../productManager.js';

const router = Router()

const cartsJsonPath = `${__dirname}/Carts.json`
const { addNewCart, addProductToCart, getCartById } = new CartManager(cartsJsonPath);

const productsJsonPath = `${__dirname}/Products.json`;
const { getProductsById } = new ProductManager(productsJsonPath)

router.post('/', async (req, res) => {
    
    const newCart = await addNewCart();
    res.status(201).send({status:'success', payload:newCart});

});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cartFound = await getCartById(parseInt(cid));

    if(!cartFound) return res.status(400).send({status:'error', error:`¡ERROR! No existe el carrito con el id ${cid}`});
    
    res.status(200).send({status:'success', payload: cartFound});

});



router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const cartFound = await getCartById(parseInt(cid));
    if (!cartFound.products) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });
    console.log(cartFound)
    const product = await getProductsById(parseInt(pid));
    
    if (!product) {
        return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
    }

    const productIndex = cartFound.products.findIndex(prod => prod.product === parseInt(pid));
    if (productIndex !== -1) {
        cartFound.products[productIndex].quantity++;
    } else {
        cartFound.products.push({ product: parseInt(pid), quantity: 1 });
    }
    await addProductToCart(parseInt(cid), parseInt(pid), 1);
    res.status(201).send({ status: 'success', payload: cartFound });
});

export default router
