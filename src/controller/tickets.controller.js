import { ticketService } from "../service/service.js";

class TicketController {
    constructor() {
        this.ticketService = ticketService;
    }

    getTicket = async (req, res) => {
        try {
            const tickets = await this.ticketService.getAll();
            res.send({ status: 'success', payload: tickets });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    getTickets = async (req, res) => {
        const { email } = req.params;
        try {
            const ticketFound = await this.ticketService.getTickets({ purchaser: email });
            res.status(200).send({ status: 'success', payload: ticketFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    removeTicket = async (req, res) => {
        const { tid } = req.params;
        try {
            const ticketFound = await this.ticketService.getTicket({ _id: tid });
            await this.ticketService.removeTicket(tid);
            res.status(200).send({ status: 'success', payload: `El ticket con id ${tid} ha sido eliminado` });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };
}

export default TicketController;
