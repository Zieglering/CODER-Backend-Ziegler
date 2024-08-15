import { cartService, productService, ticketService, userService } from "../service/service.js";
import { logger } from "../utils/logger.js";

class CartController {
    constructor() {
        this.cartService = cartService;
        this.productService = productService;
        this.ticketService = ticketService;
        this.userService = userService;
    }

    createCart = async (req, res) => {
        try {
            const newCart = await this.cartService.createCart();
            res.status(201).send({ status: 'success', payload: newCart });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    addProductToCart = async (req, res) => {
        const { cid, pid } = req.params;
        const user = req.user;
        let quantity = req.body.quantity || 1;

        try {
            const updatedCart = await this.cartService.addProductToCart(cid, pid, quantity, user);
            res.status(200).send({ status: 'success', payload: updatedCart });
        } catch (error) {
            logger.error('Error agregando producto al carrito:', error);
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    getCart = async (req, res) => {
        const { cid } = req.params;

        try {
            const cartFound = await this.cartService.getCart({ _id: cid });
            res.status(200).send({ status: 'success', payload: cartFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    updateProductFromCart = async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        try {
            const updatedCart = await this.cartService.updateProductFromCart(cid, pid, quantity);
            res.status(201).send({ status: 'success', payload: updatedCart });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    updateCart = async (req, res) => {
        const { cid } = req.params;
        const products = req.body;

        try {
            const updatedCart = await this.cartService.updateCart(cid, products);
            res.status(201).send({ status: 'success', payload: updatedCart });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    deleteProductFromCart = async (req, res) => {
        const { cid, pid } = req.params;

        try {
            await this.cartService.deleteProductFromCart(cid, pid);
            res.status(201).send({ status: 'success', payload: `El producto ${pid} ha sido eliminado del carrito ${cid}` });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    deleteCart = async (req, res) => {
        const { cid } = req.params;
        try {
            await this.cartService.deleteCart(cid);
            res.status(200).send({ status: 'success', payload: `El carrito ${cid} ha sido eliminado` });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    purchase = async (req, res) => {
        const { cid } = req.params;
        const user = req.user;

        try {
            const createdTicket = await this.cartService.purchase(cid, user);
            res.status(200).send({ status: 'success', payload: createdTicket });
        } catch (error) {
            logger.error('Error during purchase:', error);
            res.status(500).send({ status: 'error', error: error.message });
        }
    };
}

export default CartController;
