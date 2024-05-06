import { Router } from 'express'
import { __dirname } from '../../filenameUtils.js'
import CartsMongoManager from '../../daos/cartMongo.manager.js';
import ProductsMongoManager from '../../daos/productsMongo.manager.js';


const router = Router()
const cartsManager = new CartsMongoManager
const productsManager = new ProductsMongoManager


router.post('/', async (req, res) => {
    
    const newCart = await cartsManager.addNewCart();
    res.status(201).send({status:'success', payload:newCart});

});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cartFound = await cartsManager.getCartById(parseInt(cid));

    if(!cartFound) return res.status(400).send({status:'error', error:`¡ERROR! No existe el carrito con el id ${cid}`});
    
    res.status(200).send({status:'success', payload: cartFound});

});

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const cartFound = await cartsManager.getCartById(cid);


    if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

    const product = await productsManager.getProductsById(pid);
    
    if (!product) {
        return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
    }
    let quantity = 1
  
    await cartsManager.addProductToCart(parseInt(cid), parseInt(pid), parseInt(quantity));
    res.status(201).send({ status: 'success', payload: cartFound });
});


export default router
