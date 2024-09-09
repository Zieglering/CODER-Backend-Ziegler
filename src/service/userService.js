import { CustomError } from '../service/errors/CustomError.js';
import { EError } from '../service/errors/enums.js';
import { generateInvalidUserError } from '../service/errors/info.js';
import { logger } from '../utils/logger.js';
import path from 'path';
import fs from 'fs';
import __dirname from '../utils/filenameUtils.js';

export default class UserService {
    constructor(userRepository, cartRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;

    }

    async createUser(newUser) {
        const { first_name, last_name, email, age, password, cart } = newUser;
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
            throw CustomError.createError({
                name: 'Error al crear el usuario',
                cause: generateInvalidUserError({ first_name, last_name, email, password }),
                message: `Ya existe un usuario con el email ${email}`,
                code: EError.MISSING_OR_INVALID_REQUIRED_DATA_ERROR
            });
        }
        return await this.userRepository.createUser(newUser);
    }

    async getUsers() {
        const usersFound = await this.userRepository.getUsers();
        return usersFound || [];
    }

    async getUserBy(filter) {
        logger.info(JSON.stringify(filter))
        return await this.userRepository.getUserBy(filter);
    }

    async uploadDocument(userId, files) {
        if (!files) throw new Error('No se encontró el archivo');

        const userFound = await this.userRepository.getUserBy({ _id: userId });
        if (!userFound) throw new Error('Usuario no encontrado');
        if (!userFound.documents) { userFound.documents = []; }

        Object.keys(files).forEach((fieldname) => {
            const file = files[fieldname][0];
            const filePath = path.join(file.destination, file.filename);
            userFound.documents.push({
                name: file.originalname,
                reference: filePath,
            });
            logger.info(`Documento subido para el usuario ${userId}: ${file.filename} en ${file.fieldname}`);
        });
        await this.userRepository.updateUser({ _id: userId }, { documents: userFound.documents });
    }

    async updateUser(userId, updatedUserData) {
        const userFound = await this.userRepository.getUserBy({ _id: userId });
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

        const result = await this.userRepository.updateUser({ _id: userId }, updatedUser);

        if (result.nModified === 0) {
            throw new Error('No se hicieron cambios en el usuario');
        }

        return result;
    }

    async updateUserConnectionTime(userId, last_connection) {
        const userFound = await this.userRepository.getUserBy({ _id: userId });
        if (!userFound) {
            throw new Error('Usuario no encontrado');
        }
        const result = await this.userRepository.updateUser(userId, last_connection);
        return result;
    }

    async updateUserRole(userId, role) {
        const validRoles = ['user', 'premium'];
        if (!validRoles.includes(role)) {
            throw new Error('El rol a cambiar no es válido, debe ser user o premium');
        }

        const userFound = await this.userRepository.getUserBy({ _id: userId });
        if (!userFound || userFound.role === 'admin') {
            throw new Error('No existe el usuario, o no está autorizado a cambiar este usuario');
        }

        // Buscar en la carpeta de documents si tiene los documentos necesarios para cambiar a premium
        if (role === 'premium') {
            const userDocumentsFolder = path.join(__dirname, `public/uploads/${userId}/documents`);

            if (!fs.existsSync(userDocumentsFolder)) {
                throw new Error('No se encontró la carpeta de documentos del usuario');
            }

            const uploadedFiles = fs.readdirSync(userDocumentsFolder);
            const requiredSuffixes = ['-id', '-addressdocument', '-accountstatusdocument'];
            const uploadedFilesLowercase = uploadedFiles.map(file => file.toLowerCase());
            const missingDocuments = requiredSuffixes.filter(suffix => {
                return !uploadedFilesLowercase.some(file => file.includes(suffix));
            });

            if (missingDocuments.length > 0) {
                throw new Error(`Faltan los siguientes documentos requeridos: ${missingDocuments.join(', ')}`);
            }
        }
        return await this.userRepository.updateUser({ _id: userId }, { role });
    }

    async deleteUser(userId) {
        try {
            const userFound = await this.userRepository.getUserBy({ _id: userId });
            if (!userFound) {
                throw new Error(`No se encontró ningún usuario con el filtro ${userId}`);
            }
            const cartId = userFound.cart;
            await this.userRepository.deleteUser(userId);
            await this.cartRepository.deleteCart(cartId);

        } catch (error) {
            logger.error(`Error al borrar el usuario: ${userId}`);
        }
    }
}
