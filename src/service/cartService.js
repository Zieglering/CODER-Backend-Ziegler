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

    async getCart(filter) {
        const cart = await this.cartRepository.getCart(filter);
        if (!cart) {
            throw new Error(`¡ERROR! No existe el carrito con el id ${filter._id}`);
        }
        return cart;
    }

    async addProductToCart(cid, pid, quantity, user) {
        const cartFound = await this.getCart({ _id: cid });
        const product = await this.productService.getProduct({ _id: pid });
        if (!product) {
            throw new Error(`¡ERROR! No existe el producto con el id ${pid}`);
        }
        if (user.role === 'premium' && product.owner === user.email) {
            throw new Error(`El usuario ${user.email} creó el producto ${product._id} por lo tanto no puede agregarlo a su carrito`);
        }

        return await this.cartRepository.addProductToCart(cid, pid, parseInt(quantity));
    }

    async updateProductFromCart(cid, pid, quantity) {
        await this.getCart({ _id: cid });
        const product = await this.productService.getProduct({ _id: pid });
        if (!product) {
            throw new Error(`¡ERROR! No existe el producto con el id ${pid}`);
        }
        return await this.cartRepository.updateProductFromCart(cid, pid, parseInt(quantity));
    }

    async updateCart(cid, products) {
        await this.getCart({ _id: cid });
        return await this.cartRepository.updateCart(cid, products);
    }

    async deleteProductFromCart(cid, pid) {
        await this.getCart({ _id: cid });
        const product = await this.productService.getProduct({ _id: pid });
        if (!product) {
            throw new Error(`¡ERROR! No existe el producto con el id ${pid}`);
        }
        return await this.cartRepository.deleteProductFromCart(cid, pid);
    }

    async deleteCart(cid) {
        await this.getCart({ _id: cid });
        return await this.cartRepository.deleteCart(cid);
    }

    async generateUniqueCode() {
        let uniqueCode;
        let codeExists = true;

        while (codeExists) {
            uniqueCode = Math.random().toString(36).substring(2, 10).toUpperCase();
            const existingTicket = await this.ticketService.getTicket({ uniqueCode });
            if (!existingTicket) {
                codeExists = false;
            }
        }

        return uniqueCode;
    }

    async purchase(cid, user) {
        const cart = await this.getCart({ _id: cid });
        if (!cart) {
            throw new Error('Cart not found');
        }

        let productsToProcess = [];
        let productsNotProcessed = [];
        let totalAmount = 0;

        for (const item of cart.products) {
            const product = await this.productService.getProduct(item.product);
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

        if (productsToProcess.length === 0) throw new Error('No hay productos para procesar');

        const uniqueCode = await this.generateUniqueCode();
        const newTicket = {
            code: String(uniqueCode),
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: user.email
        };
        const createdTicket = await this.ticketService.createTicket(newTicket);

        for (const item of productsToProcess) {
            await this.productService.updateProduct(item.product._id, { stock: -item.quantity });
        }

        cart.products = productsNotProcessed;
        await this.cartRepository.updateCart(cart._id, cart.products);

        return createdTicket;
    }
}
