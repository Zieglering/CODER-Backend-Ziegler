import { Router } from 'express';
import CartController from '../../controller/cartsController.js';
import { authorizationJwt } from '../../utils/authorizationJwt.js';
import { passportCall } from '../../utils/passportCall.js';

const router = Router();
const {
    createCart,
    purchase,
    addProductToCart,
    getCart,
    updateProductFromCart,
    updateCart,
    deleteProductFromCart,
    deleteCart
} = new CartController();

router.post('/', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), createCart);
router.post('/:cid/purchase', passportCall('jwt'), authorizationJwt('user'), purchase);
router.post('/:cid/products/:pid', passportCall('jwt'), authorizationJwt('premium', 'user'), addProductToCart);
router.get('/:cid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), getCart);
router.put('/:cid/products/:pid', passportCall('jwt'), authorizationJwt('premium', 'user'), updateProductFromCart);
router.put('/:cid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), updateCart);
router.delete('/:cid/products/:pid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), deleteProductFromCart);
router.delete('/:cid', passportCall('jwt'), authorizationJwt('admin'), deleteCart);

export default router;