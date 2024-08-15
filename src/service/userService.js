import UserDto from '../dtos/usersDto.js';
import { CustomError } from '../service/errors/CustomError.js';
import { EError } from '../service/errors/enums.js';
import { generateInvalidUserError } from '../service/errors/info.js';
import { createHash } from '../utils/bcrypt.js';
import { cartService } from './service.js';

export default class UserService {
    constructor(userRepository, cartRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;

    }

    async createUser(userData) {
        const { first_name, last_name, email, age, password, cart } = userData;
        if (!first_name || !last_name || !email || !password) {
            throw CustomError.createError({
                name: 'Error al crear el usuario',
                cause: generateInvalidUserError({ first_name, last_name, email, password }),
                message: 'Error al crear el usuario, campos faltantes o inválidos',
                code: EError.MISSING_OR_INVALID_REQUIRED_DATA_ERROR
            });
        }

        const existingUser = await this.userRepository.getUserBy({ email });
        if (existingUser) {
            throw new Error(`Ya existe un usuario con el email ${email}`);
        }
        // const newCart = await this.cartRepository.createCart();
        // const newUser = new UserDto({
        //     first_name,
        //     last_name,
        //     email,
        //     age: parseInt(age) || null,
        //     password: createHash(password),
        //     cart: newCart._id
        // });
        

        return await this.userRepository.createUser(userData);
    }

    async getUsers(filter) {
        return await this.userRepository.getUsers(filter);
    }

    async getUserBy(filter) {
        return await this.userRepository.getUserBy(filter);
    }

    async updateUser(uid, updatedUserData) {
        const userFound = await this.userRepository.getUserBy({ _id: uid });
        if (!userFound) {
            throw new Error('Usuario no encontrado');
        }

        const { first_name, last_name, age, password, role } = updatedUserData;

        if (!first_name && !last_name && !password) {
            throw new Error('No hay nada para actualizar');
        }

        const updatedUser = {};
        if (first_name) updatedUser.first_name = first_name;
        if (last_name) updatedUser.last_name = last_name;
        if (age) updatedUser.age = age;
        if (password) updatedUser.password = password;
        if (role) updatedUser.role = role;

        const result = await this.userRepository.updateUser({ _id: uid }, updatedUser);

        if (result.nModified === 0) {
            throw new Error('No se hicieron cambios en el usuario');
        }

        return result;
    }

    async updateUserRole(uid, role) {
        const validRoles = ['user', 'premium'];
        if (!validRoles.includes(role)) {
            throw new Error('El rol a cambiar no es válido, debe ser user o premium');
        }

        const userFound = await this.userRepository.getUserBy({ _id: uid });
        if (!userFound || userFound.role === 'admin') {
            throw new Error('No existe el usuario, o no está autorizado a cambiar este usuario');
        }

        return await this.userRepository.updateUser({ _id: uid }, { role });
    }

    async deleteUser(uid) {
        const userFound = await this.userRepository.getUserBy(uid);
        const cid = userFound.cart
        if (!userFound) {
            throw new Error(`No se encontró ningún usuario con el filtro ${uid}`);
        }
        
        await this.userRepository.deleteUser(uid);
        await this.cartRepository.deleteCart(cid);
    }
}
