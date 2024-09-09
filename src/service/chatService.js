export default class ChatService {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }

    async createMessage(user, message) {
        if (message === undefined || message === null) {
            throw new Error('Error al enviar el mensaje');
        }
        return await this.chatRepository.createMessage(user, message);
    }

    async getMessages() {
        return await this.chatRepository.getMessages();
    }

    async getMessage(filter) {
        const message = await this.chatRepository.getMessage(filter);
        if (!message) {
            throw new Error(`No existe el mensaje con el id ${filter._id}`);
        }
        return message;
    }

    async updateMessage(id, update) {
        if (!update.message) {
            throw new Error('Sin cambios');
        }
        return await this.chatRepository.updateMessage(id, update);
    }

    async deleteMessage(id) {
        return await this.chatRepository.deleteMessage(id);
    }
}
