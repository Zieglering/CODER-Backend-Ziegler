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

router.post('/',createProduct);
router.get('/', getProducts);
router.get('/:pid', getProductBy);
router.put('/:pid',updateProduct);
router.delete('/:pid',removeProduct);

export default router;