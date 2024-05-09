import { Router } from "express";
import { __dirname } from '../filenameUtils.js'
import ProductsMongoManager from "../daos/productsMongo.manager.js";


const productsJsonPath = `${__dirname}/FS-Database/Products.json`;
// const productManager = new ProductManager(productsJsonPath);
const productManager = new ProductsMongoManager();
 
const router = Router()

router.get('/', async (req, res) => {
    const products = await productManager.getProducts()
    res.render('./index.hbs', {products})
})

router.get('/realtimeproducts', async (req, res) => {
    res.render('./realtimeproducts.hbs', {})
})

router.get('/chat', async (req, res) => {
    res.render('./chat.hbs', {})
})
export default router