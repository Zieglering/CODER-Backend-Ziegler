import { cartService, productService, ticketService } from "../service/service.js";

class CartController {
    constructor() {
        this.cartService = cartService;
        this.productService = productService;
        this.ticketService = ticketService
    }

    createCart = async (req, res) => {
        try {
            const newCart = await cartService.createCart();
            res.status(201).send({ status: 'success', payload: newCart });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    addProductToCart = async (req, res) => {
        const { cid, pid } = req.params;
        try {
            const cartFound = await cartService.getCart({ _id: cid });
            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });
            const product = await productService.getProduct({ _id: pid });
            if (!product) {
                return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
            }
            let quantity = req.body.quantity || 1;

            const updatedCart = await this.cartService.addProductToCart(cid, pid, parseInt(quantity));
            res.status(201).send({ status: 'success', payload: updatedCart });
        } catch (error) {
            console.error('Error agregando producto al carrito:', error);
            res.status(500).send({ status: 'error', error: error });
        }
    };

    getCart = async (req, res) => {
        const { cid } = req.params;
        const cartFound = await cartService.getCart({ _id: cid });
        try {
            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });
            res.status(200).send({ status: 'success', payload: cartFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    updateProductFromCart = async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const cartFound = await cartService.getCart({ _id: cid });
            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

            const product = await productService.getProduct({ _id: pid });
            if (!product) {
                return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
            }
            await cartService.updateProductFromCart(cid, pid, parseInt(quantity));
            res.status(201).send({ status: 'success', payload: cartFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    updateCart = async (req, res) => {
        const { cid } = req.params;
        const products = req.body;
        try {
            const cartFound = await cartService.getCart({ _id: cid });
            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

            await cartService.updateCart(cid, products);
            res.status(201).send({ status: 'success', payload: cartFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    deleteProductFromCart = async (req, res) => {
        const { cid, pid } = req.params;

        try {
            const cartFound = await cartService.getCart({ _id: cid });
            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

            const productFound = await productService.getProduct({ _id: pid });
            if (!productFound) {
                return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
            }
            await cartService.deleteProductFromCart(cid, pid);
            res.status(201).send({ status: 'success', payload: `El producto ${pid} ha sido eliminado del carrito ${cid}` });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };
    removeCart = async (req, res) => {
        const { cid } = req.params;
        try {
            const cartFound = await cartService.getCart({ _id: cid });

            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡Error! No existe el carrito` });
            res.status(200).send({ status: 'success', payload: cartFound });
            cartService.removeCart(cid);
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    generateUniqueCode = async () => {
        let code;
        let exists = true;
        while (exists) {
            code = Math.random().toString(36).substr(2, 9).toUpperCase();
            exists = await this.ticketService.getTicket({ code });
        }
        return code;
    }

    purchase = async (req, res) => {
        const { cid } = req.params;
        const user = req.user;

        try {
            const cart = await cartService.getCart({ _id: cid });
            if (!cart) {
                throw new Error('Cart not found');
            }
            const productsToProcess = [];
            const productsNotProcessed = [];

            for (const item of cart.products) {
                const product = await productService.getProduct(item.product);
                if (!product) {
                    throw new Error(`Producto con ID ${item.product} no encontrado`);
                }
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    const updatedProduct = await productService.updateProduct(product._id, product);
                    productsToProcess.push(item.product);
                } else {
                    productsNotProcessed.push(item.product);
                }
            }

                    
            cart.products = cart.products.filter(item => !productsNotProcessed.includes(item.product));
            await cartService.updateCart(cart);

            const totalAmount = cart.products.reduce((total, item) => {
                const productPrice = item.product.price;
                const quantity = item.quantity;
                return total + (productPrice * quantity);
            }, 0);

            const newTicket = {
                cartId: cart._id,
                userId: user._id,
                totalAmount,
            };

            const createdTicket = await ticketService.createTicket(newTicket);
            return res.status(200).send({ status: 'success', payload: createdTicket });
        } catch (error) {
            console.error('Error during purchase:', error);
            res.status(500).send({ status: 'error', error: { message: error.message, stack: error.stack } });
    }
    };
}

export default CartController;