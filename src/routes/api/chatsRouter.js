import { Router } from 'express';
import ChatController from '../../controller/chatsController.js';

const router = Router();
const {
    createMessage,
    getMessages,
    getMessageBy,
    updateMessage,
    deleteMessage
} = new ChatController();

router.post('/', createMessage);
router.get('/', getMessages);
router.get('/:id', getMessageBy);
router.get('/:id', updateMessage);
router.get('/:id', deleteMessage);

export default router;