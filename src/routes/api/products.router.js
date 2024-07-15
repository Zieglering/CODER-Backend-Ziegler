import { Router } from 'express';
import ProductController from '../../controller/products.controller.js';
import { passportCall } from '../../utils/passportCall.js';
import { authorizationJwt } from '../../utils/authorizationJwt.js';

const router = Router();
const {
    createProduct,
    getProducts,
    getProductBy,
    updateProduct,
    removeProduct
} = new ProductController();

router.post('/', passportCall('jwt'), authorizationJwt('admin'), createProduct);
router.get('/', getProducts);
router.get('/:pid', getProductBy);
router.put('/:pid',passportCall('jwt'), authorizationJwt('admin'), updateProduct);
router.delete('/:pid', passportCall('jwt'), authorizationJwt('admin'), removeProduct);

export default router;