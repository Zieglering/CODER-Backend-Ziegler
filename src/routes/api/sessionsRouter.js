import { Router } from 'express';
import passport from 'passport';
import sessionsController from '../../controller/sessionsController.js';
import { passportCall } from '../../utils/passportCall.js';

export const sessionsRouter = Router();
const {
    githubAuth,
    registerUser,
    loginUser,
    logoutUser,
    sendPasswordResetEmail,
    resetPassword,
    getCurrentUserRole
} = sessionsController

sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
sessionsRouter.get('/githubcallback', passport.authenticate('github', { session: false }), githubAuth);
sessionsRouter.post('/register', registerUser);
sessionsRouter.post('/login', passportCall('jwt'), loginUser);
sessionsRouter.post('/logout', passportCall('jwt'), logoutUser);
sessionsRouter.post('/send-password-reset-email', sendPasswordResetEmail);
sessionsRouter.post('/reset-password', resetPassword);
sessionsRouter.get('/current', passportCall('jwt'), getCurrentUserRole);