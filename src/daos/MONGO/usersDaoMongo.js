import { userModel } from "./models/users.models.js";

class UsersDaoMongo {
  constructor() {
    this.userModel = userModel;
  }
  create = async (newUser) => await userModel.create(newUser);
  getAll = async ({ limit = 10, numPage = 1 } = {}) => await userModel.paginate({}, { limit, page: numPage, sort: { price: -1 }, lean: true });
  getBy = async (filter) => userModel.findOne(filter).lean();
  update = async (uid, updatedUser) => await userModel.updateOne({ _id: uid }, { $set: updatedUser });
  delete = async (uid) => await userModel.deleteOne(uid);
};

export default UsersDaoMongo;