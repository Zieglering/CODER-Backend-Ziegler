import { userService, cartService } from '../service/service.js';
import UserSecureDto from '../dtos/userSecureDto.js';

class UserController {
    constructor() {
        this.userService = userService;
        this.cartService = cartService;
    }

    createUser = async (req, res) => {
        const { body } = req;
        try {
            const result = await this.userService.createUser(body);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al crear el usuario: ${error.message}` });
        }
    };

    getUsers = async (req, res) => {
        try {
            const usersFound = await this.userService.getUsers();
            const secureUsers = await usersFound.docs.map(user => new UserSecureDto(user));
            res.send({ status: 'success', payload: { users: secureUsers } });
        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al buscar los usuarios: ${error.message}` });
        }
    };

    getUserBy = async (req, res) => {
        const filter = req.query;
        try {
            const userFound = await this.userService.getUserBy(filter);
            res.send({ status: 'success', payload: userFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al buscar el usuario: ${error.message}` });
        }
    };

    uploadDocument = async (req, res) => {
        const { uid } = req.params;
        const files = req.files;

        try {
            const uploadedFile = await userService.uploadDocument(uid, files);
            res.status(200).send({ status: 'success', payload: `Archivo subido: ${uploadedFile}` });
        } catch (error) {
            res.status(500).send({ status: 'Error', message: `Error al subir el documento del usuario: ${error.message}` });
        }
    };

    updateUser = async (req, res) => {
        const { uid } = req.params;
        const { first_name, last_name, age, password, role } = req.body;

        try {
            const result = await this.userService.updateUser(uid, { first_name, age, last_name, password, role });
            res.status(200).send({ status: 'success', message: `Usuario actualizado ${result}` });
        } catch (error) {
            res.status(500).send({ status: 'Error', message: `Error al actualizar el usuario: ${error.message}` });
        }
    };

    updateRole = async (req, res) => {
        const { uid } = req.params;
        const { role } = req.body;

        try {
            const result = await this.userService.updateUserRole(uid, role);
            res.status(200).send({ status: 'success', message: `Usuario actualizado con el nuevo rol ${role}` });
        } catch (error) {
            res.status(500).send({ status: 'Error', error: `Error al actualizar el rol del usuario: ${error.message}` });
        }
    };

    updateUserConnectionTime = async (req, res) => {
        const { uid } = req.params;
        const { last_connection } = req.body;

        try {
            const result = await this.userService.updateUserConnectionTime(uid, last_connection);
            res.status(200).send({ status: 'success', message: `Usuario conectado: ${last_connection}` });
        } catch (error) {
            res.status(500).send({ status: 'Error', message: `Error al actualizar el tiempo de conección el usuario: ${error.message}` });
        }
    };

    deleteUser = async (req, res) => {
        const { uid } = req.params;
        try {
            const userFound = await this.userService.getUserBy({ _id: uid });
            const cid = userFound.cart;
            await cartService.deleteCart({ _id: cid });
            const result = await this.userService.deleteUser({ _id: uid });
            res.send({ status: 'success', payload: `user: ${result} deleted` });
        } catch (error) {
            res.status(500).send({ status: 'Error', message: `Error al borrar el usuario: ${error.message}` });
        }
    };
}

export default UserController;
