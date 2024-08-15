import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { objectConfig } from '../src/config/config.js';
import { logger } from '../src/utils/logger.js';
import productsModel from '../src/daos/MONGO/models/products.model.js';
import cartsModel from '../src/daos/MONGO/models/carts.model.js';
import { userModel } from '../src/daos/MONGO/models/users.models.js';

const { admin_email, admin_password, mongo_url } = objectConfig;
const requester = supertest('http://localhost:8080');
mongoose.connect(mongo_url);

const userMock = {
    first_name: 'nombre',
    last_name: 'apellido',
    email: 'user_mock@mail.com',
    age: 36,
    password: '123456',
};

const adminLogin = {
    email: admin_email,
    password: admin_password,
};

const productMock = {
    title: 'Café Mock',
    description: 'Mock de café',
    code: 'COF123',
    price: 99,
    status: true,
    stock: 999,
    category: 'cafe',
    thumbnails: 'image1.jpg',
};

describe('Test de eCommerce coffee shop', () => {

    describe('Test de productos', () => {
        let productId;
        let cookie;

        before(async function () {
            this.productsModel = productsModel;

        });

        beforeEach(async function () {

            const result = await requester.post('/api/sessions/login').send(adminLogin);
            const cookieResult = result.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            };
            this.timeout(5000);
        });

        afterEach(async function () {
            if (productId) {
                try {
                    await this.productsModel.findOneAndDelete({ _id: productId });
                } catch (error) {
                    logger.error(`Error borrando productMock: ${error.message}`);
                }
            }
            await requester.post('/api/sessions/logout').send();
            productId = null;
            cookie = null;
            this.timeout(5000);
        });

        it('El endpoint POST /api/products debe crear un producto correctamente', async function () {

            const { statusCode, ok, body } = await requester.post('/api/products')
                .set('Cookie', `${cookie.name}=${cookie.value}`)
                .send(productMock);
            productId = body.payload._id;

            expect(statusCode).to.be.equal(201);
            expect(ok).to.be.equal(true);
            expect(body.payload).to.have.property('_id');
            expect(body.payload.title).to.be.equal(productMock.title);
            expect(body.payload.price).to.be.equal(productMock.price);
        });

        it('El endpoint GET /api/products debe mostrar todos los productos existentes', async function () {
            const { statusCode, ok, body } = await requester.get('/api/products');
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(body.payload.products).to.be.an('array');
        });

        it('El endpoint GET /api/products/:pid debe mostrar un producto existente', async function () {
            const responseProduct = await requester.post('/api/products')
                .set('Cookie', `${cookie.name}=${cookie.value}`)
                .send(productMock);

            productId = responseProduct.body.payload._id;
            const { statusCode, ok, body } = await requester.get(`/api/products/${productId}`);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(body.payload).to.have.property('_id').equal(productId);
            expect(body.payload.title).to.be.equal(productMock.title);
        });
    });

    describe('Test de carts', () => {
        let cartId;
        let productId;
        let cookie;

        before(async function () {
            this.productsModel = productsModel;
            this.cartsModel = cartsModel;
            this.userModel = userModel;
        });

        afterEach(async function () {
            if (cartId) {
                const foundUserMock = await userModel.findOne({ email: userMock.email });
                await cartsModel.findOneAndDelete({ _id: cartId });
                await cartsModel.findOneAndDelete({ _id: foundUserMock.cart });
                await userModel.findOneAndDelete({ _id: foundUserMock._id });
            }
            if (productId) {
                await productsModel.findOneAndDelete({ _id: productId });
            }
            await requester.post('/api/sessions/logout').send();
            productId = null;
            cartId = null;
            cookie = null;
            this.timeout(5000);
        });

        it('El endpoint POST /api/carts debe crear un carrito correctamente', async function () {
            const newUser = await requester.post('/api/sessions/register').send(userMock);
            const userLogin = {
                email: userMock.email,
                password: userMock.password,
            };
            this.timeout(5000);

            const result = await requester.post('/api/sessions/login').send(userLogin);
            const cookieResult = result.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            };

            this.timeout(5000);

            const { statusCode, ok, body } = await requester.post('/api/carts')
                .set('Cookie', `${cookie.name}=${cookie.value}`)
                .send();
            cartId = body.payload._id;
            expect(statusCode).to.be.equal(201);
            expect(ok).to.be.equal(true);
            expect(body.payload).to.have.property('_id');
        });

        it('El endpoint POST /api/carts/:cid/products/:pid debe agregar un producto al carrito correctamente', async function () {
            const resultAdmin = await requester.post('/api/sessions/login').send(adminLogin);
            const cookieResultAdmin = resultAdmin.headers['set-cookie'][0];
            cookie = {
                name: cookieResultAdmin.split('=')[0],
                value: cookieResultAdmin.split('=')[1],
            };

            this.timeout(5000);

            const productResponse = await requester.post('/api/products')
                .set('Cookie', `${cookie.name}=${cookie.value}`)
                .send(productMock);

            productId = productResponse.body.payload._id;

            this.timeout(5000);

            await requester.post('/api/sessions/logout').send();
            cookie = null;
            this.timeout(5000);

            const newUser = await requester.post('/api/sessions/register').send(userMock);
            const userLogin = {
                email: userMock.email,
                password: userMock.password,
            };
            this.timeout(5000);

            const result = await requester.post('/api/sessions/login').send(userLogin);
            const cookieResult = result.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            };
            this.timeout(5000);

            const getMockUser = await userModel.findOne({ email: userMock.email });
            cartId = getMockUser.cart;

            const { statusCode, ok, body } = await requester.post(`/api/carts/${cartId}/products/${productId}`)
                .set('Cookie', `${cookie.name}=${cookie.value}`)
                .send();
            
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(body.payload.payload).to.have.property('products').to.be.an('array');
        });

        it('El endpoint GET /api/carts/:cid debe mostrar un carrito existente', async function () {
            const newUser = await requester.post('/api/sessions/register').send(userMock);
            const userLogin = {
                email: userMock.email,
                password: userMock.password,
            };
            const result = await requester.post('/api/sessions/login').send(userLogin);
            const cookieResult = result.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            };

            const newCart = await requester.post('/api/carts')
                .set('Cookie', `${cookie.name}=${cookie.value}`)
                .send();
            cartId = newCart.body.payload._id;

            const { statusCode, ok, body } = await requester.get(`/api/carts/${cartId}`)
                .set('Cookie', `${cookie.name}=${cookie.value}`);

            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(body.payload).to.have.property('products').to.be.an('array');
        });
    });

    describe('Test de sessions', () => {
        let userId;
        let cartId;
        let cookie;

        before(async function () {
            this.userModel = userModel;
            this.cartsModel = cartsModel;
        });

        afterEach(async function () {
            if (userId) { await userModel.findOneAndDelete({ _id: userId }); }
            if (cartId) { await cartsModel.findOneAndDelete({ _id: cartId }); }
            await requester.post('/api/sessions/logout').send();
            userId = null;
            cookie = null;
            this.timeout(5000);
        });

        it('El endpoint POST /api/sessions/register debe registrar un usuario correctamente', async function () {
            const { statusCode, ok, body } = await requester.post('/api/sessions/register').send(userMock);
            this.timeout(5000);

            const registeredUsedMock = await userModel.findOne({ email: userMock.email });
            userId = registeredUsedMock._id;
            cartId = registeredUsedMock.cart;

            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(registeredUsedMock).to.have.property('_id');
            expect(registeredUsedMock.email).to.be.equal(userMock.email);
        });

        it('El endpoint POST /api/sessions/login debe loguear correctamente a un usuario y devolver una cookie con un token', async function () {

            const { statusCode, ok, body } = await requester.post('/api/sessions/register').send(userMock);
            const userLogin = {
                email: userMock.email,
                password: userMock.password,
            };
            const result = await requester.post('/api/sessions/login').send(userLogin);

            const cookieResult = result.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            };
            const registeredUsedMock = await userModel.findOne({ email: userMock.email });
            userId = registeredUsedMock._id;
            cartId = registeredUsedMock.cart;

            expect(cookieResult).to.be.ok;
            expect(cookie.name).to.be.ok.and.eql('token');
            expect(cookie.value).to.be.ok;
        });

        it('El endpoint GET /api/sessions/current debe ocultar datos que no pueden ver los usuarios con el rol "user"', async function () {

            const registerResponse = await requester.post('/api/sessions/register').send(userMock);
            const registeredUsedMock = await userModel.findOne({ email: userMock.email });
            userId = registeredUsedMock._id;
            cartId = registeredUsedMock.cart;


            const loginResponse = await requester.post('/api/sessions/login').send({
                email: userMock.email,
                password: userMock.password,
            });


            const cookieResult = loginResponse.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            };

            const { statusCode, ok, body } = await requester.get('/api/sessions/current')
                .set('Cookie', `${cookie.name}=${cookie.value}`);

            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(body).to.have.property('payload').equal('user');
        });

        it('El endpoint GET /api/sessions/current debe mostrar datos a usuarios con el rol "admin"', async function () {

            const result = await requester.post('/api/sessions/login').send(adminLogin);
            const cookieResult = result.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            };
            this.timeout(5000);

            const { statusCode, ok, body } = await requester.get('/api/sessions/current')
                .set('Cookie', `${cookie.name}=${cookie.value}`);

            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(body).to.have.property('payload').equal('admin');
        });
    });
});
