import { Router } from "express";
import { passportCall } from "../utils/passportCall.js";
import { authorizationJwt } from "../utils/authorizationJwt.js";
import viewsController from "../controller/viewsController.js"

const router = Router();
const {
home,
login,
register,
passwordRecovery,
resetPassword,
usersManager,
userDetails,
index,
productDetails,
cartDetails,
tickets,
createProducts,
realTimeProducts,
chat,
mockingProducts
} = viewsController

router.get('/', passportCall('jwt'), home);
router.get('/login', login);
router.get('/register', register);
router.get('/password-recovery', passwordRecovery);
router.get('/reset-password', passportCall('jwt'), resetPassword);
router.get('/users-manager', passportCall('jwt'), authorizationJwt('admin'), usersManager);
router.get('/user/:uid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), userDetails);
router.get('/index', passportCall('jwt'), index);
router.get('/product/:pid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), productDetails);
router.get('/cart/:cid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), cartDetails);
router.get('/tickets', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), tickets);
router.get('/create-products', passportCall('jwt'), authorizationJwt('admin', 'premium'), createProducts);
router.get('/realtimeproducts', passportCall('jwt'), authorizationJwt('admin', 'premium'), realTimeProducts);
router.get('/chat', passportCall('jwt'), authorizationJwt('user', 'premium'), chat);
router.get('/mockingproducts', authorizationJwt('admin', 'premium'), mockingProducts);

export default router;