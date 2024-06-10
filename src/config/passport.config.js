import passport from 'passport';
import { UsersManagerMongo } from '../daos/usersManagerMongo.js';
import GithubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import { PRIVATE_KEY, generateToken } from '../utils/jsonwebtoken.js';
import CartsMongoManager from '../daos/cartsManagerMongo.js';

const userService = new UsersManagerMongo();
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const cartsService = new CartsMongoManager

export const initializePassport = () => {

    const cookieExtractor = (req) => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['token'];
        }
        return token;
    };

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            if (!jwt_payload) return done(null, false, { message: 'Usuario no encontrado' });
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('github', new GithubStrategy({
        clientID: 'Iv23liQxo01u9lMy7LxQ',
        clientSecret: 'fe4104715d07c3b0f2c65f81e450feaf9f659d08',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userService.getUserBy({ email: profile._json.login });
            const newCart = await cartsService.addNewCart()
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    email: profile._json.login,
                    age: null,
                    password: '',
                    cartID: newCart._id
                };
                let result = await userService.createUser(newUser);
                user = result;
            } 
            const token = generateToken({ id: user._id, email: user.email, role: user.role, cartID: newCart._id });
            user.token = token;

            done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
};