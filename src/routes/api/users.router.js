import { Router } from 'express';
import UserController from '../../controller/users.controller.js';
import { authorizationJwt } from '../../utils/authorizationJwt.js';
import { passportCall } from '../../utils/passportCall.js';


const router = Router();
const {
    createUser,
    getUsers,
    getUserBy,
    updateUser,
    updateRole,
    removeUser
} = new UserController();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:uid', getUserBy);
router.put('/:uid', updateUser);
router.put('/premium/:uid', passportCall('jwt'), authorizationJwt('admin', 'premium'), updateRole);
router.delete('/:uid', removeUser);

export default router;