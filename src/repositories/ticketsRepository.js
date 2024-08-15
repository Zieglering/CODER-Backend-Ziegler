export default class TicketsRepository {
    constructor(ticketsDao) {
        this.ticketsDao = ticketsDao;
    }

    createTicket = async newTicket => await this.ticketsDao.create(newTicket);
    getTicket = async filter => await this.ticketsDao.getBy(filter);
    getTickets = async filter => await this.ticketsDao.getAll(filter);
    deleteTicket = async tid => await this.ticketsDao.delete(tid);
}