import { Router } from 'express';
import ChatController from '../../controller/chats.controller.js';

const router = Router();
const {
    getMessage,
    createMessage
} = new ChatController;

router.get('/', getMessage);
router.post('/', createMessage);

export default router;