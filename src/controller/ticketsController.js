import { ticketService } from "../service/service.js";

class TicketController {
    constructor() {
        this.ticketService = ticketService;
    }

    createTicket = async (req, res) => {
        try {
            const newTicket = await this.ticketService.createTicket();
            res.send({ status: 'success', payload: newTicket });
        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al crear el ticket: ${error.message}` });
        }
    }

    getTicket = async (req, res) => {
        try {
            const ticket = await this.ticketService.getTicket();
            res.send({ status: 'success', payload: ticket });
        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al buscar el ticket: ${error.message}` });
        }
    };

    getTickets = async (req, res) => {
        const { email } = req.params;
        try {
            const ticketFound = await this.ticketService.getTickets({ purchaser: email });
            res.status(200).send({ status: 'success', payload: ticketFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al buscar los tickets: ${error.message}` });
        }
    };

    deleteTicket = async (req, res) => {
        const { tid } = req.params;
        try {
            const ticketFound = await this.ticketService.getTicket({ _id: tid });
            await this.ticketService.deleteTicket({ _id: tid });
            res.status(200).send({ status: 'success', payload: `El ticket ${ticketFound} ha sido eliminado` });
        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al borrar el ticket: ${error.message}` });
        }
    };
}

export default TicketController;