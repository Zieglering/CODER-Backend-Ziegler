import { Router } from 'express';
import TicketController from '../../controller/ticketsController.js';
import { authorizationJwt } from '../../utils/authorizationJwt.js';
import { passportCall } from '../../utils/passportCall.js';

const router = Router();
const {
    getTicketBy,
    deleteTicket,
    getTickets
} = new TicketController();

router.get('/:tid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), getTicketBy);
router.get('/', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), getTickets);
router.delete('/:tid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), deleteTicket);

export default router;