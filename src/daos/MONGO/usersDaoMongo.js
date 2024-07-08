import { userModel } from "./models/users.models.js";

class UsersDaoMongo {
  constructor() {
    this.userModel = userModel;
  }

  create = async(newUser) => {
    return await userModel.create(newUser);
  }

  getAll = async ({ limit = 10, numPage = 1 } = {}) => {
    const users = await this.userModel.paginate({}, { limit, page: numPage, sort: { price: -1 }, lean: true });
    return users;
  }

  getBy = async(filter) => {
    return userModel.findOne(filter);
  }

  update = async(uid, updatedUser) => {
    return await userModel.updateOne(uid, { $set: updatedUser });
  }

  remove = async (filter) => {
    return await userModel.deleteOne(filter);
  };
}

export default UsersDaoMongo;