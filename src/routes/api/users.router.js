import { Router } from 'express';
import UserController from '../../controller/users.controller.js';

const router = Router();
const {
    createUser,
    getUsers,
    getUserBy,
    updateUser,
    removeUser,
    updateRole
} = new UserController();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:uid', getUserBy);
router.put('/:uid', updateUser);
router.put('/premium/:uid', updateRole);
router.delete('/:uid', removeUser);

export default router;