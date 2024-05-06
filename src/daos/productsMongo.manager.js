// CRUD en mongo
import productsModel from "./models/products.model.js";



class ProductsMongoManager {
    constructor() {
        this.productsModel = productsModel;
    }

    getProducts = async () => {
        return await this.productsModel.find();
    }
    addProduct = async (title, description, code, price, status, stock, category, thumbnails = './images/IMG_placeholder.jpg') => {
        const newProduct = {
            id: await this.getNextId(),
            title: title,
            description: description,
            code: code,
            price: price,
            status: status,
            stock: stock,
            category: category,
            thumbnails: thumbnails
        }
        try {
            return await this.productsModel.collection.insertOne(newProduct);
            
        } catch (error) {
            throw error
        }
    }
    getProductsById = async (productId) => {
        return await this.productsModel.find({id: parseInt(productId)});
    }
    updateProduct = async (productId, updatedProduct) => {
        return await this.productsModel.updateOne({id: productId}, {$set: updatedProduct} );
    }
    deleteProduct = async (productId) => {
        return await this.productsModel.deleteOne({id: productId});
    }

    getNextId = async () => {
        const lastProduct = await this.productsModel.findOne().sort({ id: -1 });
        if (!lastProduct) {
            return 1;
          } else {
            return lastProduct.id + 1;
          }
    };
    }


    export default ProductsMongoManager