import { logger } from "../utils/logger.js";

export default class TicketService {
    constructor(ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    async createTicket(ticketData) {
        try {
            return await this.ticketRepository.createTicket(ticketData);

        } catch (error) {
            logger.error(`Error: ${error}`);
        }
    }

    async getTickets() {
        const tickets = await this.ticketRepository.getTickets();
        if (!tickets) {
            throw new Error(`¡ERROR! No existe el ticket`);
        }
        return tickets;
    }

    async getTicketBy(filter) {
        try {
            const ticket = await this.ticketRepository.getTicketBy(filter);
            if (!ticket) {
                throw new Error(`¡Error! No existe el ticket con ${JSON.stringify(filter)}`);
            }
            return ticket;
            
        } catch (error) {
            logger.error(`No existe el ticket: ${error}`)
        }
    }

    async deleteTicket(tid) {
        const ticket = await this.getTicketBy({ _id: tid });
        return await this.ticketRepository.deleteTicket(tid);
    }
}