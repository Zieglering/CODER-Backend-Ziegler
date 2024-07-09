import { Router } from 'express';
import CartController from '../../controller/carts.controller.js';
import { authorizationJwt } from '../../utils/authorizationJwt.js';
import { passportCall } from '../../utils/passportCall.js';

const router = Router();
const {
    createCart,
    addProductToCart,
    purchase,
    getCart,
    updateProductFromCart,
    updateCart,
    deleteProductFromCart,
    removeCart
} = new CartController();

router.post('/', createCart);
router.post('/:cid/purchase', passportCall('jwt'), authorizationJwt('user', 'admin'), purchase);
router.post('/:cid/products/:pid', passportCall('jwt'), authorizationJwt('user'), addProductToCart);
router.get('/:cid', getCart);
router.put('/:cid/products/:pid', updateProductFromCart);
router.put('/:cid', updateCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.delete('/:cid', removeCart);

export default router;