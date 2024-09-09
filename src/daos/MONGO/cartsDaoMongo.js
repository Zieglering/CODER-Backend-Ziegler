import { logger } from "../../utils/logger.js";
import cartsModel from "./models/carts.model.js";

class CartsDaoMongo {
    constructor() {
        this.cartsModel = cartsModel;
    }

    create = async () => {
        const cart = { products: [] };
        return await this.cartsModel.create(cart);
    };

    addProductToCart = async (cartId, productId, quantity) => {
        const cartExists = this.cartsModel.where({ _id: cartId, 'products.product': productId });
        const productExists = await cartExists.findOne().lean();

        if (!productExists) {
            const updatedCart = await this.cartsModel.findOneAndUpdate(
                { _id: cartId },
                { $addToSet: { products: { product: productId, quantity } } },
                { new: true, upsert: true }
            );
            return updatedCart;

        } else {
            const updatedCart = await this.cartsModel.findOneAndUpdate(
                { _id: cartId, 'products.product': productId },
                { $inc: { 'products.$.quantity': quantity } },
                { new: true }
            );
            logger.info(`cartExists: ${cartExists}`)
            logger.info(`productExists: ${productExists}`)
            logger.info(`updated cart: ${updatedCart}`)
            return updatedCart;
        }
    };

    getBy = async (filter) => {
        return await this.cartsModel.findOne(filter).lean();
    };

    updateProductFromCart = async (cartId, productId, quantity) => {
        const cartExists = this.cartsModel.where({ _id: cartId, 'products.product': productId });
        const productExists = await cartExists.find();

        if (!productExists) {
            throw new Error(`El producto no existe en el carrito ${cartId}`);
        }

        const updatedCart = await this.cartsModel.findOneAndUpdate(
            { _id: cartId, 'products.product': productId },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        );
        return updatedCart;
    };

    update = async (cartId, products) => {
        return await this.cartsModel.findOneAndUpdate(
            { _id: cartId },
            { $set: { products } },
            { new: true }
        );
    };

    deleteProductFromCart = async (cartId, productId) => await this.cartsModel.findOneAndUpdate(
        { _id: cartId },
        { $pull: { products: { product: productId } } },
        { new: true }
    );

    delete = async (cartId) => await this.cartsModel.findOneAndDelete({ _id: cartId });
}

export default CartsDaoMongo;