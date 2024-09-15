import passport from 'passport';
import jwt from 'passport-jwt';
import GithubStrategy from 'passport-github2';
import { PRIVATE_KEY, generateToken } from '../utils/jsonwebtoken.js';
import { objectConfig } from './config.js';
import { cartService, userService } from '../service/service.js';

const { github_CallbackURL, github_ClientSecret, github_ClientID } = objectConfig;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

export const initializePassport = () => {

    const cookieExtractor = (req) => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['token'];
        }
        return token;
    };

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]) || ExtractJWT.fromAuthHeaderAsBearerToken(),
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
        clientID: github_ClientID,
        clientSecret: github_ClientSecret,
        callbackURL: github_CallbackURL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            if (!email) {
                email = `${profile.username}@github.com`;
            }
            let user = await userService.getUserBy({ email });
            const newCart = await cartService.createCart();
            if (!user) {
                let newUser = {
                    first_name: profile._json.name || profile.username,
                    last_name: profile._json.name || profile.username,
                    email,
                    age: null,
                    password: '',
                    cart: newCart._id
                };
                let result = await userService.createUser(newUser);
                user = result;
            }
            const token = generateToken({ id: user._id, email: user.email, role: user.role, cart: newCart._id });
            user.token = token;

            done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
};