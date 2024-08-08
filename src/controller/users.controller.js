import { userService } from '../service/service.js';

class UserController {
    constructor() {
        this.userService = userService;
    }

    getUsers = async (req, res) => {
        try {
            const users = await this.userService.getUsers();
            res.send({ status: 'success', payload: users.docs });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    getUserBy = async (req, res) => {
        const { uid } = req.params;
        try {
            const userFound = await this.userService.getUserBy({ _id: uid });
            res.send({ status: 'success', payload: userFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    createUser = async (req, res) => {
        const { body } = req;
        try {
            const result = await this.userService.createUser(body);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    updateUser = async (req, res) => {
        const { uid } = req.params;
        const { first_name, last_name, age, password, role } = req.body;

        try {
            const result = await this.userService.updateUser(uid, { first_name, age, last_name, password, role });
            res.status(200).send({ status: 'success', message: `Usuario actualizado ${result}` });
        } catch (error) {
            res.status(500).send({ status: 'Error', message: error.message });
        }
    };

    updateRole = async (req, res) => {
        const { uid } = req.params;
        const { role } = req.body;

        try {
            const result = await this.userService.updateUserRole(uid, role);
            res.status(200).send({ status: 'success', message: `Usuario actualizado con el nuevo rol ${role}` });
        } catch (error) {
            res.status(500).send({ status: 'Error', message: error.message });
        }
    };

    removeUser = async (req, res) => {
        const { uid } = req.params;
        try {
            const result = await this.userService.deleteUser({_id:uid});
            res.send({ status: 'success', payload: `user: ${result} deleted` });
        } catch (error) {
            res.status(500).send({ status: 'Error', message: error.message });
        }
    };
}

export default UserController;
