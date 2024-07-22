import { logger } from "../../utils/logger.js";
import ticketModel from "./models/ticket.model.js";

class TicketsDaoMongo {
  constructor() {
    this.ticketModel = ticketModel;
  }

  create = async (ticketData) => {
    
    try {
      const result = await ticketModel.create(ticketData);
      return result;
  } catch (error) {
    
      logger.error('Error creating ticket:', error);
      throw error;
  }
  };

  getBy = async (filter) => {
    return ticketModel.findOne(filter).lean();
  };
  getAll = async (filter) => {
    return ticketModel.find(filter).lean();
  };

  remove = async (filter) => {
    return await ticketModel.deleteOne(filter);
  };
}

export default TicketsDaoMongo;