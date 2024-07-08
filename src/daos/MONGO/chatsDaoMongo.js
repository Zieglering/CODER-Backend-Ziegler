import { chatsModel } from './models/chat.model.js';

class ChatsDaoMongo {
    constructor() {
        this.chatsModel = chatsModel;
    }

    create = async (user, message) => {
        const newMessage = {
            user: user,
            message: message
        };
        return await chatsModel.create(newMessage);
    };

    getAll = async () => {
        return await chatsModel.find().lean();
    };

    getBy = async (filter) => {
        return await chatsModel.findOne(filter).lean();
    };

    update = async (filter, update) => {
        return await this.productsModel.updateOne({ _id: filter }, { $set: `Editado: ${update}` });
    };

    remove = async (filter) => {
        return await this.productsModel.deleteOne({ _id: filter });
    };
}

export default ChatsDaoMongo;