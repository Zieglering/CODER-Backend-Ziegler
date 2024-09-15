export default class TicketsRepository {
    constructor(ticketsDao) {
        this.ticketsDao = ticketsDao;
    }

    createTicket = async newTicket => await this.ticketsDao.create(newTicket);
    getTicketBy = async filter => await this.ticketsDao.getBy(filter);
    getTickets = async () => await this.ticketsDao.getAll();
    deleteTicket = async tid => await this.ticketsDao.delete(tid);
}