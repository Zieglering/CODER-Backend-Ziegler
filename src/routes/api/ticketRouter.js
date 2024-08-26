import { Router } from 'express';
import TicketController from '../../controller/tickets.controller';
import { authorizationJwt } from '../../utils/authorizationJwt.js';
import { passportCall } from '../../utils/passportCall.js';

const router = Router();
const {
    getTicket,
    deleteTicket
} = new TicketController();

router.get('/:tid', passportCall('jwt'), getTicket);
router.delete('/:tid', passportCall('jwt'), deleteTicket);

export default router;