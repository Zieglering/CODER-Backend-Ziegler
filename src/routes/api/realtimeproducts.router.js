import { Router } from 'express';
import __dirname from '../../utils/filenameUtils.js';
import RealTimeProductController from '../../controller/realTimeProductsController.js';

const router = Router();
const {
    createRealTimeProduct,
    getRealTimeProducts,
    getRealTimeProductBy,
    updateRealTimeProduct,
    removeRealTimeProduct
} = new RealTimeProductController()

router.post('/', createRealTimeProduct);
router.get('/', getRealTimeProducts);
router.get('/:pid', getRealTimeProductBy);
router.put('/:pid', updateRealTimeProduct);
router.delete('/:pid', removeRealTimeProduct);

export default router;