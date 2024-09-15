import { Router } from 'express';
import ChatController from '../../controller/chatsController.js';
import { passportCall } from '../../utils/passportCall.js';
import { authorizationJwt } from '../../utils/authorizationJwt.js';

const router = Router();
const {
    createMessage,
    getMessages,
    getMessageBy,
    updateMessage,
    deleteMessage
} = new ChatController();

router.post('/', passportCall('jwt'), authorizationJwt('premium', 'user'), createMessage);
router.get('/', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), getMessages);
router.get('/:id', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), getMessageBy);
router.get('/:id', passportCall('jwt'), authorizationJwt('premium', 'user'), updateMessage);
router.get('/:id', passportCall('jwt'), authorizationJwt('premium', 'user'), deleteMessage);

export default router;