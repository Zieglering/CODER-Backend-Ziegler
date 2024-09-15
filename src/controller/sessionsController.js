import sessionsService from '../service/sessionsService.js';
import { PRIVATE_KEY } from '../utils/jsonwebtoken.js';
import { logger } from '../utils/logger.js';
import jwt from 'jsonwebtoken'

const sessionsController = {
  
  githubAuth: (req, res) => {
    if (req.user && req.user.token) {
      res.cookie('token', req.user.token, { httpOnly: true });
      res.redirect('/index');
    } else {
      res.status(401).send('Error de autenticación');
    }
  },

  registerUser: async (req, res) => {
    try {
      const token = await sessionsService.registerUser(req.body);
      return res.status(201).send({ status: 'success', message: 'Usuario registrado correctamente', token });
    } catch (error) {
      logger.error('Error al intentar registrar un usuario:', error);
      return res.status(500).send({ status: 'error', error: error.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const { token, role } = await sessionsService.loginUser(email, password);
      return res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
        .status(200).send({ status: 'success', message: 'Usuario Logueado correctamente', role });
    } catch (error) {
      logger.error('Error al intentar loguearse:', error);
      return res.status(500).send({ status: 'error', error: error.message });
    }
  },

  logoutUser: async (req, res) => {
    try {
      await sessionsService.logoutUser(req.user);
      res.clearCookie('token');
      return res.redirect('/index');
    } catch (error) {
      logger.error('Error al intentar desloguearse:', error);
      return res.status(500).send({ status: 'error', error: error.message });
    }
  },

  sendPasswordResetEmail: async (req, res) => {
    try {
      const { email } = req.body;
      await sessionsService.sendPasswordResetEmail(email);
      return res.status(200).send({ status: 'success', message: 'Email enviado a la casilla del usuario' });
    } catch (error) {
      logger.error('Error al enviar el email:', error);
      return res.status(500).send({ status: 'error', error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
        logger.info(`Token: ${token}`);
        
        if (!token) {
            return res.status(400).send({ status: 'error', message: error.message });
        }

        const userPayload = jwt.verify(token, PRIVATE_KEY);
        const userId = userPayload.id;
        const { newPassword, newPasswordRetype } = req.body;

        await sessionsService.resetPassword(userId, newPassword, newPasswordRetype);

        res.status(200).send({ status: 'success', message: 'Password actualizado correctamente' });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
},

  getCurrentUserRole: (req, res) => {
    try {
      const role = sessionsService.getCurrentUserRole(req.user);
      return res.status(200).send({ status: 'success', role });
    } catch (error) {
      logger.error('Error al buscar el rol del usuario:', error);
      return res.status(500).send({ status: 'error', error: error.message });
    }
  }
};

export default sessionsController;