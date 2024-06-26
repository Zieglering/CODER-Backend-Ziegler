import { Router } from 'express';
import __dirname from '../../utils/filenameUtils.js';
import ProductDao from '../../daos/productsDaoFS.js';
import realTimeProductController from '../../controller/realTimeProductsController.js';

const productsJsonPath = `${__dirname}/FS-Database/Products.json`;
const router = Router();
const { getProducts, addProduct } = new ProductDao(productsJsonPath);

const {
    getRealTimeProducts,
    createRealTimeProduct
} = new realTimeProductController()

router.get('/', getRealTimeProducts);
router.post('/', createRealTimeProduct);

export default router;