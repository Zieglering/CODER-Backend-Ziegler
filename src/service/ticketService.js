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

    async getTickets(filter) {
        const tickets = await this.ticketRepository.getTickets(filter);
        if (!tickets) {
            throw new Error(`¡ERROR! No existe el ticket del usuario ${filter.purchaser}`);
        }
        return tickets;
    }

    async getTicket(filter) {
        try {
            const ticket = await this.ticketRepository.getTicket(filter);
            if (!ticket) {
                throw new Error(`¡Error! No existe el ticket con ${JSON.stringify(filter)}`);
            }
            return ticket;
            
        } catch (error) {
            logger.error(`No existe el ticket: ${error}`)
        }
    }

    async deleteTicket(tid) {
        const ticket = await this.getTicket({ _id: tid });
        return await this.ticketRepository.deleteTicket(tid);
    }
}
