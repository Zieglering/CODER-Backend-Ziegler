import { Router } from "express";
import { __dirname } from '../utils.js'
import ProductManager from '../productManager.js';


const productsJsonPath = `${__dirname}/Products.json`;
const productManager = new ProductManager(productsJsonPath);

const router = Router()

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home.handlebars', {products})
})

router.get('/realtimeproducts', async (req, res) => {
    res.render('realtimeproducts.handlebars', {})
})


export default router