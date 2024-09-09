import { logger } from "../../utils/logger.js";
import ticketModel from "./models/ticket.model.js";

class TicketsDaoMongo {
  constructor() {
    this.ticketModel = ticketModel;
  }

  create = async (ticketData) => {
    return await ticketModel.create(ticketData);
  };

  getBy = async (filter) => {
    return ticketModel.findOne(filter).lean();
  };
  getAll = async (filter) => {
    return ticketModel.find(filter).lean();
  };

  delete = async (filter) => {
    return await ticketModel.deleteOne(filter);
  };
}

export default TicketsDaoMongo;