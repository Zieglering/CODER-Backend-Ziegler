
import cartsModel from "./models/carts.model.js";

class CartsMongoManager {
    constructor() {
        this.cartsModel = cartsModel;
    }

    addNewCart = async () => {
        const cart = {
            id: await this.getNextId(),
            products: []
        };
        return await this.cartsModel.collection.insertOne(cart);
    }

    addProductToCart = async (cartId, product, quantity) => {
        try {

            const cartExists = this.cartsModel.where({ id: cartId, 'products.product': product })
            const productExists = await cartExists.find()


            if (productExists.length === 0) {
                const addNewProduct = await this.cartsModel.findOneAndUpdate(
                    { id: cartId },
                    { $addToSet: { products: { product: product, quantity: quantity } } },
                    { new: true, upsert: true }
                ).lean();
                return { status: 'success', payload: addNewProduct };

            } else {
                const incrementQuantity = await this.cartsModel.findOneAndUpdate(
                    { id: cartId, 'products.product': product },
                    { $inc: { 'products.$.quantity': 1 } },
                    { new: true }

                );
                return { status: 'success', payload: incrementQuantity };
            }
        } catch (error) {
            return error;
        }
    };

    getCartById = async (cartId) => {
        try {
            return await this.cartsModel.findOne({ id: parseInt(cartId) });


        } catch (error) {
            return error;
        }
    };

    getNextId = async () => {
        const lastCart = await this.cartsModel.findOne().sort({ id: -1 });
        if (!lastCart) {
            return 1;
        } else {
            return lastCart.id + 1;
        }
    };


}

export default CartsMongoManager;