import { Router } from 'express';
import { UsersManagerMongo } from '../../daos/usersManagerMongo.js';
import { auth } from '../../middlewares/auth.middleware.js';
import { createHash, isValidPassword } from '../../utils/bcrypt.js';
import passport from 'passport';

export const sessionsRouter = Router();
const userService = new UsersManagerMongo;

sessionsRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}))


sessionsRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}),(req,res) => {
    req.session.user = req.user
    res.redirect('/products')
})

sessionsRouter.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!email || !password) return res.status(401).send({ status: 'error', error: `Faltan campos, ingresa email y password` });

        const userExist = await userService.getUserBy({ email });
        if (userExist) return res.status(401).send({ status: 'error', error: `El usuario con el email ${userExist.email} ya existe` });

        const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password)
        };
        await userService.createUser(newUser);
        return res.status(200).send({ status:'Success', message:'Usuario registrado correctamente'});
    } catch (error) {
        console.log('error:', error);
        return res.status(500).send({ status: 'error', error: 'Ocurrió un error, por favor intentalo nuevamente' });
    }
});

sessionsRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // Admin hardcodeado
    const adminEmail = 'adminCoder@coder.com';
    const adminPassword = 'adminCod3r123';

    if (email === adminEmail && password === adminPassword) {
        req.session.user = {
            email: adminEmail,
            role: 'admin',
        };
        return res.status(200).send({ status:'Success', message:`Usuario ${email} Logueado con exito`})
    }

    if (!email || !password) return res.status(401).render('login.hbs', ({ status: 'error', error: `Faltan campos, ingresa email y password` }));

    const userFound = await userService.getUserBy({ email });
    if (!userFound) return res.status(400).render('login.hbs', ({ status: 'error', error: `Usuario no encontrado` }));

    if(!isValidPassword(password, {password: userFound.password})) return res.status(401).send({status:'error', error:'Password incorrecto'})

    req.session.user = {
        email,
        role: userFound.role,
    };
    res.redirect('/products');
});

sessionsRouter.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    res.send({ status: 'success', message: 'Usuario registrado correctamente' });
});


sessionsRouter.post('/failregister', async (req, res) => {
    res.send({ error: 'Falló el registro' });
});



sessionsRouter.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: 'error', error: 'Credenciales invalidas' });
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        role: req.user.role,
        email: req.user.email
    };
    res.send(({status:'success', payload: req.user}))
});


sessionsRouter.post('/faillogin', (req, res) => {
    res.send({ error: 'Falló el login' });
});

sessionsRouter.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send({ status: 'error', error: err });
        else return res.render('/login');
    });
});

sessionsRouter.get('/current', auth, (req, res) => {
    res.send('datos sensibles');
});