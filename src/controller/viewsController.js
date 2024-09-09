import viewsService from "../service/viewsService.js";
import { logger } from "../utils/logger.js";

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

    passwordRecovery: (req, res) => {
        res.render('password-recovery.hbs');
    },

    resetPassword: (req, res) => {
        const token = req.token;
        if (!token) {
            return res.render('password-recovery.hbs');
        }

        try {
            const tokenCheck = jwt.verify(token, jwt_private_key);
            res.render('reset-password.hbs', { token });
        } catch (error) {
            logger.error('Token Invalido o expirado:', error);
            res.render('password-recovery.hbs');
        }
    },

    usersManager: async (req, res) => {
        const user = req.user
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
          res.status(500).send({ status: 'error', message: 'Failed to load users' });
        }
      },

    userDetails: async (req, res) => {
        const { uid } = req.params;
        const user = await viewsService.getUserDetails(uid);
        res.render('user.hbs', { user });
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
            email: user.email,
            role: user.role,
            cart: user.cart,
          });
        } catch (error) {
          res.status(500).send({ status: 'error', message: 'Failed to load products' });
        }
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
            page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            totalPages,
          } = await viewsService.getProducts({ limit, pageNum, filter, sortByPrice });
    
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
            email: user.email,
            products,
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
          res.status(500).send({ status: 'error', message: 'Failed to load products' });
        }
      },
    
      realTimeProducts: async (req, res) => {
        const user = req.user;
        res.render('realtimeproducts.hbs', { user });
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
          res.status(500).send({ status: 'error', message: 'Failed to generate mocking products' });
        }
      }
};

export default viewsController;