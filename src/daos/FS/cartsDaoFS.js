import fs from 'fs';
import { __dirname } from '../filenameUtils.js';
import { logger } from '../../utils/logger.js';

const path = `${__dirname}/Carts.json`;

class CartsDaoFS {
    constructor(path) {
        this.path = path;
    }

    readCartsJson = async () => {
        try {
            const cartsJson = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(cartsJson);
        } catch (error) {
            logger.error(error);
            return [];
        }
    };

    writeCart = async (cartsData) => {
        await fs.promises.writeFile(this.path, JSON.stringify(cartsData, null, '\t'), 'utf-8');
    };

    create = async () => {
        const cart = {
            id: await this.getNextId(),
            products: []
        };
        const cartsData = await this.readCartsJson();
        cartsData.push(cart);
        await this.writeCart(cartsData);
        return cartsData;
    };

    addProductToCart = async (cartId, product, quantity) => {
        try {
            const cartsData = await this.readCartsJson();
            const cartIndex = cartsData.findIndex(cart => cart.id === cartId);

            if (cartIndex === -1) {
                throw new Error(`No existe el carrito con el id ${cartId}`);
            }

            const cart = cartsData[cartIndex];

            const existingProductIndex = cart.products.findIndex(prod => prod.product === product);

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ product, quantity });
            }

            await this.writeCart(cartsData);
            return cart;

        } catch (error) {
            return error;
        }
    };

    getBy = async (filter) => {
        try {
            const cartsData = await this.readCartsJson();
            const foundCart = cartsData.find(cart => cart.filter === filter);

            if (foundCart) return foundCart;
            return [];
        } catch (error) {
            return error;
        }
    };

    getNextId = async () => {
        const cartsData = await this.readCartsJson();
        if (cartsData.length === 0) {
            return 1;
        };
        return cartsData[cartsData.length - 1].id + 1;
    };
}

export default CartsDaoFS;