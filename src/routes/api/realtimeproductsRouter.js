import { Router } from 'express';
import RealTimeProductController from '../../controller/realTimeProductsController.js';
import { passportCall } from '../../utils/passportCall.js';
import { authorizationJwt } from '../../utils/authorizationJwt.js';
import ProductController from '../../controller/productsController.js';

const router = Router();
const {
    createProduct,
    getProducts,
    getProductBy,
    updateProduct,
    deleteProduct
} = new ProductController();

router.post('/', passportCall('jwt'), authorizationJwt('admin', 'premium'), createProduct);
router.get('/', passportCall('jwt'), authorizationJwt('admin', 'premium'), getProducts);
router.get('/:pid', passportCall('jwt'), authorizationJwt('admin', 'premium'), getProductBy);
router.put('/:pid', passportCall('jwt'), authorizationJwt('admin', 'premium'), updateProduct);
router.delete('/:pid', passportCall('jwt'), authorizationJwt('admin', 'premium'), deleteProduct);

export default router;