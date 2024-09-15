import { objectConfig } from "../config/config.js";
import viewsService from "../service/viewsService.js";
import { logger } from "../utils/logger.js";
import jwt from 'jsonwebtoken';

const { jwt_private_key } = objectConfig;

const viewsController = {
  home: (req, res) => {
    res.redirect('/index');
  },

  login: (req, res) => {
    const token = req.cookies.token;
    if (token) {
      return res.redirect('/index');
    }
    return res.render('login.hbs');
  },

  register: (req, res) => {
    res.render('register.hbs');
  },

  index: async (req, res) => {
    const { limit = 10, pageNum = 1, category, status, product: title, sortByPrice } = req.query;
    const user = req.user || {};

    try {
      const {
        docs: products,
        totalPages,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      } = await viewsService.getProducts({ limit, pageNum, category, status, title, sortByPrice });

      let prevLink = null;
      let nextLink = null;

      if (hasPrevPage) {
        prevLink = `/index?pageNum=${prevPage}`;
        if (limit) prevLink += `&limit=${limit}`;
        if (title) prevLink += `&title=${title}`;
        if (category) prevLink += `&category=${category}`;
        if (status) prevLink += `&status=${status}`;
        if (sortByPrice) prevLink += `&sortByPrice=${sortByPrice}`;
      }

      if (hasNextPage) {
        nextLink = `/index?pageNum=${nextPage}`;
        if (limit) nextLink += `&limit=${limit}`;
        if (title) nextLink += `&title=${title}`;
        if (category) nextLink += `&category=${category}`;
        if (status) nextLink += `&status=${status}`;
        if (sortByPrice) nextLink += `&sortByPrice=${sortByPrice}`;
      }

      return res.render('index.hbs', {
        products,
        totalPages,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        prevLink,
        nextLink,
        category,
        sortByPrice,
        availability: status,
        isAuthenticated: req.isAuthenticated,
        user,
        first_name: user.first_name,
        email: user.email,
        role: user.role,
        cart: user.cart,
      });
    } catch (error) {
      res.status(500).send({ status: 'error', message: 'Error al buscar los productos' });
    }
  },

  passwordRecovery: (req, res) => res.render('password-recovery.hbs'),

  resetPassword: (req, res) => {
    const token = req.query.token;
    const user = req.user;

    if (!token) return res.render('password-recovery.hbs');

    try {
      const tokenCheck = jwt.verify(token, jwt_private_key);
      res.render('reset-password.hbs', { tokenCheck, user });
    } catch (error) {
      logger.error('Token invalido o expirado:', error);
      res.render('password-recovery.hbs');
    }
  },

  usersManager: async (req, res) => {
    const user = req.user;
    const { numPage, limit } = req.query;

    try {
      const {
        docs: users,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      } = await viewsService.getUsers({ limit, numPage });

      res.render('users.hbs', {
        user,
        users,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      });
    } catch (error) {
      res.status(500).send({ status: 'error', message: 'Error al buscar los usuarios' });
    }
  },

  userDetails: async (req, res) => {
    const user = req.user;
    res.render('user.hbs', { user });
  },

  productDetails: async (req, res) => {
    const user = req.user;
    const { pid } = req.params;
    try {
      const product = await viewsService.getProductDetails(pid);
      res.render('product.hbs', { product, cart: req.user.cart, user });
    } catch (error) {
      res.send({ status: "error", error: error.message });
    }
  },

  cartDetails: async (req, res) => {
    const user = req.user;
    const { cid } = req.params;
    const cart = await viewsService.getCartDetails(cid);
    res.render('cart.hbs', { cart, user });
  },

  tickets: async (req, res) => {
    const user = req.user;
    const tickets = await viewsService.getUserTickets(user.email);
    res.render('tickets.hbs', { tickets, user });
  },

  createProducts: async (req, res) => {
    const user = req.user;
    const { limit = 10, pageNum = 1, category, status, title, sortByPrice } = req.query;
    let filter = {};

    if (user.role === 'premium') {
      filter.owner = user.email;
    }
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (title) filter.title = new RegExp(title, 'i');

    try {
      const {
        docs: products,
        totalPages,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      } = await viewsService.getProducts({ limit, pageNum, category, filter, status, title, sortByPrice });

      const productsCreatedByUser = products.forEach(product => {
        product.owner === user.email;
      });

      let prevLink = null;
      let nextLink = null;
      if (hasPrevPage) {
        prevLink = `/create-products?pageNum=${prevPage}`;
        if (limit) prevLink += `&limit=${limit}`;
        if (title) prevLink += `&title=${title}`;
        if (category) prevLink += `&category=${category}`;
        if (status) prevLink += `&status=${status}`;
        if (sortByPrice) prevLink += `&sortByPrice=${sortByPrice}`;
      }

      if (hasNextPage) {
        nextLink = `/create-products?pageNum=${nextPage}`;
        if (limit) nextLink += `&limit=${limit}`;
        if (title) nextLink += `&title=${title}`;
        if (category) nextLink += `&category=${category}`;
        if (status) nextLink += `&status=${status}`;
        if (sortByPrice) nextLink += `&sortByPrice=${sortByPrice}`;
      }

      return res.render('create-products.hbs', {
        user,
        products,
        email: user.email,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
        category,
        sortByPrice,
        availability: status,
        role: user.role,
        cart: user.cart
      });
    } catch (error) {
      res.status(500).send({ status: 'error', message: 'Error al buscar los productos' });
    }
  },

  realTimeProducts: async (req, res) => {
    const user = req.user;
    const { limit = 10, pageNum = 1, category, status, title, sortByPrice } = req.query;
    let filter = {};

    if (user.role === 'premium') {
        filter.owner = user.email;
    }
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (title) filter.title = new RegExp(title, 'i');

    try {
        const {
            docs: products,
            totalPages,
            page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        } = await viewsService.getProducts({ limit, pageNum, filter, sortByPrice });
        const productsCreatedByUser = products;
        let prevLink = null;
        let nextLink = null;

        if (hasPrevPage) {
            prevLink = `/realtimeproducts?pageNum=${prevPage}`;
            if (limit) prevLink += `&limit=${limit}`;
            if (title) prevLink += `&title=${title}`;
            if (category) prevLink += `&category=${category}`;
            if (status) prevLink += `&status=${status}`;
            if (sortByPrice) prevLink += `&sortByPrice=${sortByPrice}`;
        }

        if (hasNextPage) {
            nextLink = `/realtimeproducts?pageNum=${nextPage}`;
            if (limit) nextLink += `&limit=${limit}`;
            if (title) nextLink += `&title=${title}`;
            if (category) nextLink += `&category=${category}`;
            if (status) nextLink += `&status=${status}`;
            if (sortByPrice) nextLink += `&sortByPrice=${sortByPrice}`;
        }

        return res.render('realtimeproducts.hbs', {
            user,
            products: productsCreatedByUser,
            email: user.email,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
            category,
            sortByPrice,
            availability: status,
            role: user.role,
            cart: user.cart
        });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al buscar los productos' });
    }
},

  chat: async (req, res) => {
    const user = req.user;
    res.render('chat.hbs', { user });
  },

  mockingProducts: async (req, res) => {
    try {
      const products = viewsService.generateMockingProducts();
      res.send({ status: 'success', payload: products });
    } catch (error) {
      res.status(500).send({ status: 'error', message: 'Error al generar productos' });
    }
  }
};

export default viewsController;