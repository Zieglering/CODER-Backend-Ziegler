import { Router } from 'express';
import __dirname from '../../utils/filenameUtils.js';
import RealTimeProductController from '../../controller/realTimeProductsController.js';
import { passportCall } from '../../utils/passportCall.js';
import { authorizationJwt } from '../../utils/authorizationJwt.js';

const router = Router();
const {
    createRealTimeProduct,
    getRealTimeProducts,
    getRealTimeProductBy,
    updateRealTimeProduct,
    deleteRealTimeProduct
} = new RealTimeProductController();

router.post('/', passportCall('jwt'), authorizationJwt('admin', 'premium'), createRealTimeProduct);
router.get('/', getRealTimeProducts);
router.get('/:pid', passportCall('jwt'), authorizationJwt('admin', 'premium'), getRealTimeProductBy);
router.put('/:pid', passportCall('jwt'), authorizationJwt('admin', 'premium'), updateRealTimeProduct);
router.delete('/:pid', passportCall('jwt'), authorizationJwt('admin', 'premium'), deleteRealTimeProduct);

export default router;