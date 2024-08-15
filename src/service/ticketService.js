export default class TicketService {
    constructor(ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    async getAll() {
        return await this.ticketRepository.getAll();
    }

    async getTickets(filter) {
        const tickets = await this.ticketRepository.getTickets(filter);
        if (!tickets) {
            throw new Error(`¡ERROR! No existe el ticket del usuario ${filter.purchaser}`);
        }
        return tickets;
    }

    async getTicket(filter) {
        const ticket = await this.ticketRepository.getTicket(filter);
        if (!ticket) {
            throw new Error(`¡Error! No existe el ticket con id ${filter._id}`);
        }
        return ticket;
    }

    async deleteTicket(tid) {
        const ticket = await this.getTicket({ _id: tid });
        return await this.ticketRepository.deleteTicket(tid);
    }
}
