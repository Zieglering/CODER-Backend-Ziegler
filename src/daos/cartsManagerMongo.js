import cartsModel from "./models/carts.model.js";

class CartsMongoManager {
    constructor() {
        this.cartsModel = cartsModel;
    }

    addNewCart = async () => {
        const cart = {
            products: []
        };
        const createdCart = await this.cartsModel.create(cart);
        return createdCart;
    };

    addProductToCart = async (cartId, product, quantity) => {
        const cartExists = this.cartsModel.where({ _id: cartId, 'products.product': product });
        const productExists = await cartExists.find();

        if (productExists.length === 0) {
            const addNewProduct = await this.cartsModel.findOneAndUpdate(
                { _id: cartId },
                { $addToSet: { products: { product: product, quantity: quantity } } },
                { new: true, upsert: true }
            );
            return { status: 'success', payload: addNewProduct };

        } else {
            const incrementQuantity = await this.cartsModel.findOneAndUpdate(
                { _id: cartId, 'products.product': product },
                { $inc: { 'products.$.quantity': quantity } },
                { new: true }
            );
            return { status: 'success', payload: incrementQuantity };
        }
    };

    getCartBy = async (filter) => await this.cartsModel.findOne(filter).lean();

    updateProductFromCart = async (cartId, product, quantity) => {
        const cartExists = this.cartsModel.where({ _id: cartId, 'products.product': product });
        const productExists = await cartExists.find();

        if (productExists.length === 0) {
            return { status: 'success', payload: `El producto no existe en el carrito ${cartId}` };
        }
        else {
            const updatedProduct = await this.cartsModel.findOneAndUpdate(
                { _id: cartId, 'products.product': product },
                { $set: { 'products.$.quantity': quantity } },
                { new: true }
            );
            return { status: 'success', payload: updatedProduct };
        }
    };

    updateCart = async (cid, pid) => {
        const result = await cartsModel.findOneAndUpdate(
            { _id: cid, 'prodcuts.product': pid },
            { $inc: { 'products.$.quantity': 1 } },
            { new: true }
        );
        if (result) return result;
        const newProductInCart = await cartsModel.findOneAndUpdate(
            { _ud: cid },
            { $push: { products: { product: pid, quantity: 1 } } },
            { new: true }
        );
        return newProductInCart;
    };

    deleteProductFromCart = async (cid, pid) => await cartsModel.findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { product: pid, quantity: 1 } } },
        { new: true }
    );

    deleteCart = async (cid) => cartsModel.findOneAndUpdate(
        { _id: cid },
        { $set: { products: [] } },
        { new: true }
    );
}


export default CartsMongoManager;