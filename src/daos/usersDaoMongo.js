import { userModel } from "./models/users.models.js";

class UsersDaoMongo {
  constructor() {
    this.userModel = userModel;
  }

  async getUsers({limit = 10, numPage = 1}={}) {
    const users = await this.userModel.paginate({}, { limit, page: numPage, sort: { price: -1 }, lean: true });
    return users;
  }

  async createUser(newUser) {
    return await userModel.create(newUser);
  }

  async getUserBy(filter) {
    return userModel.findOne(filter);
  }

  async updateUser(filter, updatedUser) {
    return await userModel.updateOne(filter, {$set: updatedUser});
  }

  deleteUser = async (filter) => {
    return await userModel.deleteOne(filter);
}

}

export default UsersDaoMongo