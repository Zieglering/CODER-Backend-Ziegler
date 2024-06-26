import {chatsModel} from './models/chat.model.js'

class ChatDaoMongo {
    constructor() {
        this.chatsModel = chatsModel
    }
    
    getMessages = async() => {
        return await chatsModel.find();
    }
    
    addMessage = async(user, message) => {
        const newMessage = {
            user:user,
            message:message
        }
        
            console.log(newMessage)
            return  await chatsModel.create(newMessage);
    }
}

export default ChatDaoMongo