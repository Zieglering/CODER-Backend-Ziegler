import ticketModel from "./models/ticket.model.js";

class TicketsDaoMongo {
  constructor() {
    this.ticketModel = ticketModel;
  }

  create = async (newTicket) => {
    return await this.ticketModel.create(newTicket);
  };

  getBy = async (filter) => {
    return ticketModel.findOne(filter);
  };

  remove = async (filter) => {
    return await ticketModel.deleteOne(filter);
  };
}

export default TicketsDaoMongo;