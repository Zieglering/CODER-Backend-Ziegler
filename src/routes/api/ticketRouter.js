import { Router } from 'express';
import TicketController from '../../controller/tickets.controller';

const router = Router();
const {
    getTicket,
    deleteTicket
} = new TicketController();

router.get('/:tid', getTicket);
router.delete('/:tid', deleteTicket);

export default router;