// import { Router } from "express";
// import { passportCall } from "../utils/passportCall.js";
// import { authorizationJwt } from "../utils/authorizationJwt.js";
// import { productService, cartService, userService, ticketService } from "../service/service.js";
// import UserDto from "../dtos/usersDto.js";
// import UserSecureDto from "../dtos/userSecureDto.js";
// import generateProductsMock from "../utils/generateProductsMock.js";
// import { logger } from "../utils/logger.js";
// import jwt from 'jsonwebtoken';
// import { objectConfig } from "../config/config.js";

// const { jwt_private_key } = objectConfig;
// const router = Router();

// // router.get('/', async(req, res) => {
// //     return res.render('index')
// // })

// router.get('/', passportCall('jwt'), async (req, res) => {
//     res.redirect('/index');
// });

// router.get('/login', passportCall('jwt'), (req, res) => {
//     const token = req.cookies.token;

//     if (token) {
//         return res.redirect('/index');
//     }
//     return res.render('login.hbs');
// });

// router.get('/register', (req, res) => {
//     res.render('register.hbs');
// });
// router.get('/password-recovery', async (req, res) => {
//     res.render('password-recovery.hbs');
// });
// router.get('/reset-password', async (req, res) => {
//     const token = req.token;

//     if (!token) {
//         return res.render('password-recovery.hbs');
//     }

//     try {
//         const tokenCheck = jwt.verify(token, jwt_private_key);
//         logger.info('Token: ', tokenCheck);
//         res.render('reset-password.hbs', { token });
//     } catch (error) {
//         logger.error('Token Invalido o expirado:', error);
//         res.render('password-recovery.hbs');
//     }
// });

// aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
// router.get('/users-manager', passportCall('jwt'), authorizationJwt('admin'), async (req, res) => {
//     const { numPage, limit } = req.query;
//     const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = await userService.getUsers({ limit, numPage });

//     res.render('users.hbs', {
//         users: docs,
//         page,
//         hasNextPage,
//         hasPrevPage,
//         nextPage,
//         prevPage
//     });
// });

// router.get('/user/:uid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), async (req, res) => {
//     const user = req.user;
//     const { uid } = req.params;
//     const userData = await userService.getUserBy({ _id: uid });
//     // const secureUser = new UserSecureDto(user);
//     return res.render('user.hbs', { user, userData });
// });

// router.get('/index', passportCall('jwt'), async (req, res) => {
//     const { limit = 10, pageNum = 1, category, status, product: title, sortByPrice } = req.query;
//     const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } = await productService.getProducts({ limit, pageNum, category, status, title, sortByPrice });
//     const user = req.user || {};

//     let prevLink = null;
//     let nextLink = null;
//     if (hasPrevPage) {
//         prevLink = `/index?pageNum=${prevPage}`;
//         if (limit) prevLink += `&limit=${limit}`;
//         if (title) prevLink += `&title=${title}`;
//         if (category) prevLink += `&category=${category}`;
//         if (status) prevLink += `&status=${status}`;
//         if (sortByPrice) prevLink += `&sortByPrice=${sortByPrice}`;
//     }

//     if (hasNextPage) {
//         nextLink = `/index?pageNum=${nextPage}`;
//         if (limit) nextLink += `&limit=${limit}`;
//         if (title) nextLink += `&product=${title}`;
//         if (category) nextLink += `&category=${category}`;
//         if (status) nextLink += `&status=${status}`;
//         if (sortByPrice) nextLink += `&sortByPrice=${sortByPrice}`;
//     }
//     return res.render('index.hbs', {
//         products: docs,
//         totalPages,
//         prevPage,
//         nextPage,
//         page,
//         hasPrevPage,
//         hasNextPage,
//         prevLink,
//         nextLink,
//         category,
//         sortByPrice,
//         availability: status,
//         isAuthenticated: req.isAuthenticated,
//         user: req.user,
//         email: user?.email,
//         role: user?.role,
//         cart: user?.cart
//     });
// });

// router.get('/product/:pid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), async (req, res) => {
//     const user = req.user;
//     const { pid } = req.params;
//     try {
//         const product = await productService.getProduct({ _id: pid });
//         res.render('product.hbs', { product, cart: req.user.cart, user });

//     } catch (error) {
//         res.send({ status: "error", error: error.message });
//     }
// });

// router.get('/cart/:cid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), async (req, res) => {
//     const user = req.user;
//     const { cid } = req.params;
//     const cart = await cartService.getCart({ _id: cid });
//     res.render('cart.hbs', { cart, user });
// });

// router.get('/tickets', passportCall('jwt'), async (req, res) => {
//     const user = req.user;
//     const ticket = await ticketService.getTickets({ purchaser: user.email });

//     res.render('tickets.hbs', { ticket, user });
// });

// router.get('/create-products', passportCall('jwt'), authorizationJwt('admin', 'premium'), async (req, res) => {
//     const user = req.user;
//     const { limit = 10, pageNum = 1, category, status, title, sortByPrice } = req.query;
//     let filter = {};
//     if (user.role === 'premium') {
//         filter.owner = user.email;
//     }
//     if (category) filter.category = category;
//     if (status) filter.status = status;
//     if (title) filter.title = new RegExp(title, 'i');

//     const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } = await productService.getProducts({
//         limit,
//         pageNum,
//         filter,
//         sortByPrice
//     });

//     let prevLink = null;
//     let nextLink = null;
//     if (hasPrevPage) {
//         prevLink = `/create-products?pageNum=${prevPage}`;
//         if (limit) prevLink += `&limit=${limit}`;
//         if (title) prevLink += `&title=${title}`;
//         if (category) prevLink += `&category=${category}`;
//         if (status) prevLink += `&status=${status}`;
//         if (sortByPrice) prevLink += `&sortByPrice=${sortByPrice}`;
//     }

//     if (hasNextPage) {
//         nextLink = `/create-products?pageNum=${nextPage}`;
//         if (limit) nextLink += `&limit=${limit}`;
//         if (title) nextLink += `&title=${title}`;
//         if (category) nextLink += `&category=${category}`;
//         if (status) nextLink += `&status=${status}`;
//         if (sortByPrice) nextLink += `&sortByPrice=${sortByPrice}`;
//     }

//     return res.render('create-products.hbs', {
//         user,
//         email: user.email,
//         products: docs,
//         totalPages,
//         prevPage,
//         nextPage,
//         page,
//         hasPrevPage,
//         hasNextPage,
//         prevLink,
//         nextLink,
//         category,
//         sortByPrice,
//         availability: status,
//         role: user.role,
//         cart: user.cart
//     });
// });

// router.get('/realtimeproducts', passportCall('jwt'), async (req, res) => {
//     res.render('realtimeproducts.hbs', { user });
// });

// router.get('/chat', passportCall('jwt'), authorizationJwt('user'), async (req, res) => {
//     res.render('./chat.hbs', { user });
// });

// router.get('/mockingproducts', (req, res) => {
//     let products = [];
//     for (let i = 0; i < 100; i++) {
//         products.push(generateProductsMock());

//     }
//     res.send({ status: 'success', payload: products });
// });

// export default router;

import { Router } from "express";
import { passportCall } from "../utils/passportCall.js";
import { authorizationJwt } from "../utils/authorizationJwt.js";
import viewsController from "../controller/viewsController.js";

const router = Router();

router.get('/', passportCall('jwt'), viewsController.home);
router.get('/login', passportCall('jwt'), viewsController.login);
router.get('/register', viewsController.register);
router.get('/password-recovery', viewsController.passwordRecovery);
router.get('/reset-password', viewsController.resetPassword);
router.get('/users-manager', passportCall('jwt'), authorizationJwt('admin'), viewsController.usersManager);
router.get('/user/:uid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), viewsController.userDetails);
router.get('/index', passportCall('jwt'), viewsController.index);
router.get('/product/:pid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), viewsController.productDetails);
router.get('/cart/:cid', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), viewsController.cartDetails);
router.get('/tickets', passportCall('jwt'), viewsController.tickets);
router.get('/create-products', passportCall('jwt'), authorizationJwt('admin', 'premium'), viewsController.createProducts);
router.get('/realtimeproducts', passportCall('jwt'), viewsController.realTimeProducts);
router.get('/chat', passportCall('jwt'), authorizationJwt('user'), viewsController.chat);
router.get('/mockingproducts', viewsController.mockingProducts);

export default router;
