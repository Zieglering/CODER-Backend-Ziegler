import { Router } from 'express';
import TicketController from '../../controller/tickets.controller';

const router = Router();
const {
    getTicket,
    removeTicket
} = new TicketController();

router.get('/:tid', getTicket);
router.delete('/:tid', removeTicket);

export default router;