import { chatService } from "../service/service.js";

class ChatController {
    constructor() {
        this.chatService = chatService;
    }

    createMessage = async (req, res) => {
        try {
            const { user, message } = req.body;
            const newMessage = await this.chatService.createMessage(user, message);
            res.status(201).send({ status: 'success', payload: newMessage });
        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al crear el mensaje: ${error.message}` });
        }
    };

    getMessages = async (req, res) => {
        try {
            const messages = await this.chatService.getMessages();
            res.status(200).send({ status: 'success', payload: messages });
        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al buscar los mensajes: ${error.message}` });
        }
    };

    getMessageBy = async (req, res) => {
        try {
            const { pid: id } = req.params;
            const messageFound = await this.chatService.getMessage({ _id: id });
            res.status(200).send({ status: 'success', payload: messageFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al buscar el mensaje: ${error.message}` });
        }
    };

    updateMessage = async (req, res) => {
        const { id } = req.params;
        const { message } = req.body;
        try {
            const updatedMessage = await this.chatService.updateMessage(id, { message });
            res.status(201).send({ status: 'success', payload: updatedMessage });
        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al actualizar el mensaje: ${error.message}` });
        }
    };

    deleteMessage = async (req, res) => {
        const { pid: id } = req.params;
        try {
            await this.chatService.deleteMessage(id);
            res.status(200).send({ status: 'success', payload: `El mensaje con id ${id} ha sido eliminado` });
        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al borrar el mensaje: ${error.message}` });
        }
    };
}

export default ChatController;
