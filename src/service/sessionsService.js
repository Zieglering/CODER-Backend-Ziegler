import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jsonwebtoken.js';
import { cartService, userService } from './service.js';
import { sendEmailMessage } from '../utils/sendEmailMessage.js';
import { objectConfig } from '../config/config.js';
import { logger } from '../utils/logger.js';

const { admin_email, admin_password, admin_cart } = objectConfig;

const sessionsService = {

  registerUser: async ({ first_name, last_name, email, age, password }) => {
    const userExist = await userService.getUserBy({ email });
    if (userExist) throw new Error(`Ya existe un usuario con el email: ${userExist.email}`);

    const newCart = await cartService.createCart();
    const newUser = {
      first_name,
      last_name,
      email,
      age: parseInt(age) || null,
      password: createHash(password),
      cart: newCart._id
    };

    const createdUser = await userService.createUser(newUser);
    return generateToken({ id: createdUser._id, email, role: createdUser.role, cart: createdUser.cart });
  },

  loginUser: async (email, password) => {
    if (!email || !password) throw new Error('Email y password son requeridos');

    // Admin login
    if (email === admin_email && password === admin_password) {
      const token = generateToken({ email: admin_email, role: 'admin', cart: admin_cart });
      return { token, role: 'admin' };
    }

    // User login
    const user = await userService.getUserBy({ email });
    if (!user) throw new Error('Este email no está registrado en nuestro servidor');
    if (!isValidPassword(password, { password: user.password })) throw new Error('Password Incorrecto');

    await userService.updateUserConnectionTime({ _id: user._id }, { last_connection: new Date() });
    const token = generateToken({ id: user._id, email, role: user.role, cart: user.cart });
    return { token, role: user.role };
  },

  logoutUser: async (user) => {
    const currentUser = await userService.getUserBy({ email: user.email });
    if (currentUser) {
      await userService.updateUserConnectionTime({ _id: currentUser._id }, { last_connection: new Date() });
    }
  },

  sendPasswordResetEmail: async (email) => {
    const user = await userService.getUserBy({ email });
    if (!user) throw new Error(`No existe el usuario con el email ${email}`);

    const token = generateToken({ id: user._id }, '1h');

    await sendEmailMessage({
      email: user.email,
      subject: 'Restablecer contraseña',
      html: `<h1>Hola! ${user.first_name} ${user.last_name}</h1><a href="http://localhost:8080/reset-password?token=${token}">Crea una nueva contraseña aqui</a>`
    });

    return token;
  },

  resetPassword: async (userId, newPassword, newPasswordRetype) => {
    if (!newPassword || newPassword !== newPasswordRetype) {
      throw new Error('El password no coincide');
    }

    const userFound = await userService.getUserBy({ _id: userId });
    if (!userFound) {
      throw new Error('Usuario no encontrado');
    }

    if (isValidPassword(newPassword, userFound)) {
      throw new Error('El nuevo password no puede ser igual al anterior');
    }

    await userService.updateUser(userId, { password: createHash(newPassword) });
  },

  getCurrentUserRole: (user) => {
    return user.role;
  }
};

export default sessionsService;