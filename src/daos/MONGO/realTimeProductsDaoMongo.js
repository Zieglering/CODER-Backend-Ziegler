import productsModel from "./models/products.model.js";

class RealTimeProductsDaoMongo {
    constructor() {
        this.productsModel = productsModel;
    }

    create = async (newProduct) => {
        return await this.productsModel.create(newProduct);
    };

    getAll = async ({ limit = 10, pageNum = 1, filter = {}, sortByPrice, category, status, title } = {}) => {
        const query = { ...filter };
        if (category) query.category = category;
        if (status) query.status = status;
        if (title) query.$text = { $search: title, $diacriticSensitive: false };

        let toSortedByPrice = {};
        if (sortByPrice) toSortedByPrice = { price: parseInt(sortByPrice) };

        return await this.productsModel.paginate(query, { limit: limit, page: pageNum, lean: true, sort: toSortedByPrice });
    };

    getBy = async (filter) => {
        return await this.productsModel.findOne(filter).lean();
    };

    update = async (productId, updatedProduct) => {
        return await this.productsModel.findByIdAndUpdate(productId, updatedProduct, { new: true });
    };

    delete = async (productId) => {
        return await this.productsModel.findByIdAndDelete(productId);
    };
}

export default RealTimeProductsDaoMongo;