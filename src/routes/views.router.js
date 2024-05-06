import { Router } from "express";
import { __dirname } from '../filenameUtils.js'
import ProductManager from '../daos/productsFS.manager.js';


const productsJsonPath = `${__dirname}/Products.json`;
const productManager = new ProductManager(productsJsonPath);

const router = Router()

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('./index.hbs', {products})
})

router.get('/realtimeproducts', async (req, res) => {
    res.render('./realtimeproducts.hbs', {})
})

router.get('/chat', async (req, res) => {
    res.render('./chat.hbs', {})
})
export default router