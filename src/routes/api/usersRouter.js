import { Router } from 'express';
import UserController from '../../controller/usersController.js';
import { authorizationJwt } from '../../utils/authorizationJwt.js';
import { passportCall } from '../../utils/passportCall.js';
import uploader from '../../middlewares/multer.js';

const router = Router();
const {
    createUser,
    uploadDocument,
    getUsers,
    getUserBy,
    updateUser,
    updateRole,
    deleteUser
} = new UserController();

router.post('/', createUser);
router.post('/:uid/documents', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), uploader, uploadDocument);
router.get('/', passportCall('jwt'), authorizationJwt('admin', 'premium'), getUsers);
router.get('/:uid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), getUserBy);
router.put('/:uid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), updateUser);
router.put('/premium/:uid', passportCall('jwt'), authorizationJwt('admin', 'premium'), updateRole);
router.delete('/:uid', passportCall('jwt'), authorizationJwt('admin'), deleteUser);

export default router;