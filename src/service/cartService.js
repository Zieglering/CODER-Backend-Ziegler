import { logger } from "../utils/logger.js";

export default class CartService {
    constructor(cartRepository, productService, ticketService, userService) {
        this.cartRepository = cartRepository;
        this.productService = productService;
        this.ticketService = ticketService;
        this.userService = userService;
    }

    async createCart() {
        return await this.cartRepository.createCart();
    }

    async getCartBy(filter) {
        const cart = await this.cartRepository.getCartBy(filter);
        if (!cart) {
            throw new Error(`¡ERROR! No existe el carrito`);
        }
        const totalAmount = await this.calculateTotalAmount(cart.products);
        cart.totalAmount = totalAmount;

        return cart;
    }

    async addProductToCart(cartId, productId, quantity, user) {
        const cart = await this.getCartBy({ _id: cartId });
        const product = await this.productService.getProductBy({ _id: productId });
        if (!product) {
            throw new Error(`¡ERROR! No existe el producto que intenta agregar`);
        }
        if (user.role === 'premium' && product.owner === user.email) {
            throw new Error(`El usuario ${user.email} creó el producto ${product._id} por lo tanto no puede agregarlo a su propio carrito`);
        }

        const updatedCart = await this.cartRepository.addProductToCart(cartId, productId, parseInt(quantity));
        const totalAmount = await this.calculateTotalAmount(updatedCart.products);

        updatedCart.totalAmount = totalAmount;
        return updatedCart;
    }

    async updateProductFromCart(cartId, productId, quantity) {
        const product = await this.productService.getProductBy({ _id: productId });
        if (!product) {
            throw new Error(`¡ERROR! No se encuentra el producto`);
        }
        return await this.cartRepository.updateProductFromCart(cartId, productId, parseInt(quantity));
    }

    async updateCart(cartId, products) {
        return await this.cartRepository.updateCart(cartId, products);
    }

    async deleteProductFromCart(cartId, productId) {
        const product = await this.productService.getProductBy({ _id: productId });
        if (!product) {
            throw new Error(`¡ERROR! No se encuentra el producto`);
        }
        return await this.cartRepository.deleteProductFromCart(cartId, productId);
    }

    async deleteCart(cartId) {
        return await this.cartRepository.deleteCart(cartId);
    }

    async purchase(cid, user) {
        const cart = await this.getCartBy({ _id: cid });
        if (!cart) {
            throw new Error('¡ERROR! No se encuentra el carrito');
        }

        const { productsToProcess, productsNotProcessed, totalAmount } = await this.processCartProducts(cart.products);
        if (productsToProcess.length === 0) throw new Error('No hay productos para procesar');
        const uniqueCode = await this.generateUniqueCode();
        const newTicket = {
            code: String(uniqueCode),
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: user.email
        };
        const createdTicket = await this.ticketService.createTicket(newTicket);
        await this.updateProductStock(productsToProcess);
        cart.products = productsNotProcessed;
        await this.cartRepository.updateCart(cart._id, cart.products);

        return createdTicket;
    }

    async calculateTotalAmount(products) {
        let totalAmount = 0;
        for (const item of products) {
            const product = await this.productService.getProductBy(item.product);
            if (product) {
                totalAmount += product.price * item.quantity;
            }
        }
        return totalAmount;
    }

    async generateUniqueCode() {
        let uniqueCode;
        let codeExists = true;

        while (codeExists) {
            uniqueCode = Math.random().toString(36).substring(2, 10).toUpperCase();
            const existingTicket = await this.ticketService.getTicketBy({ code: uniqueCode });

            if (!existingTicket) codeExists = false;
            return uniqueCode;
        }
    }

    async processCartProducts(cartProducts) {
        let productsToProcess = [];
        let productsNotProcessed = [];
        let totalAmount = 0;

        for (const item of cartProducts) {
            const product = await this.productService.getProductBy(item.product);
            if (!product) {
                throw new Error(`Producto con ID ${item.product} no encontrado`);
            }

            if (product.stock >= item.quantity) {
                productsToProcess.push(item);
                totalAmount += product.price * item.quantity;
            } else {
                productsNotProcessed.push(item);
            }
        }

        return { productsToProcess, productsNotProcessed, totalAmount };
    }

    async updateProductStock(productsToProcess) {
        for (const item of productsToProcess) {
            const product = await this.productService.getProductBy(item.product._id);
            const newStock = product.stock - item.quantity;

            if (newStock < 0) {
                throw new Error(`Stock insuficiente para el producto ${product._id}`);
            }

            await this.productService.updateProduct(product._id, { stock: newStock });
        }
    }
}