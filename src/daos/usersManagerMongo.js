import { userModel } from "./models/users.models.js";

export class UsersManagerMongo {
  constructor() {
    this.userModel = userModel;
  }

  async getUsers({ limit = 10, numPage = 1 }) {
    const users = await this.userModel.paginate({}, { limit, page: numPage, sort: { price: -1 }, lean: true });
    return users;
  }

  async createUser(newUser) {
    return await this.userModel.create(newUser);
  }

  async getUserBy(filter) {
    return this.userModel.findOne(filter);
  }

  async updateUser(filter, updatedUser) {
    return await this.userModel.updateOne(filter, {$set: updatedUser});
  }

  deleteUser = async (filter) => {
    return await this.productsModel.deleteOne(filter);
}

}