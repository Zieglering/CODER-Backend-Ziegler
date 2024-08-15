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
    deleteProduct
} = new ProductController();

router.post('/', passportCall('jwt'), authorizationJwt('admin', 'premium'),createProduct);
router.get('/', getProducts);
router.get('/:pid', getProductBy);
router.put('/:pid',passportCall('jwt'), authorizationJwt('admin', 'premium'), updateProduct);
router.delete('/:pid', passportCall('jwt'), authorizationJwt('admin', 'premium'), deleteProduct);

export default router;