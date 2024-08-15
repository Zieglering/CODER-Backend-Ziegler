import { Router } from 'express';
import CartController from '../../controller/carts.controller.js';
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
router.post('/:cid/products/:pid', passportCall('jwt'), authorizationJwt('user', 'premium'), addProductToCart);
router.get('/:cid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), getCart);
router.put('/:cid/products/:pid', updateProductFromCart);
router.put('/:cid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), updateCart);
router.delete('/:cid/products/:pid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), deleteProductFromCart);
router.delete('/:cid', passportCall('jwt'), authorizationJwt('admin'), deleteCart);

export default router;