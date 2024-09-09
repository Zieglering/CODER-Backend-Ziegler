export default class RealTimeProductsService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async getAll() {
        return await this.productRepository.getAll();
    }

    async create(title, description, code, price, status, stock, category, thumbnails) {
        const products = await this.getAll();

        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Faltan campos');
        }

        if (products.find((prod) => prod.code === code)) {
            throw new Error(`No se pudo agregar el producto con el código ${code} porque ya existe un producto con ese código`);
        }

        const newProduct = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        };

        return await this.productRepository.create(newProduct);
    }

    async getProducts() {
        return await this.productRepository.getAll();
    }

    async getBy(filter) {
        const product = await this.productRepository.getBy(filter);
        if (!product) {
            throw new Error(`¡ERROR! No existe ningún producto con el id ${filter._id}`);
        }
        return product;
    }

    async update(id, updateData) {
        const product = await this.getBy({ _id: id });

        if (!updateData.title || !updateData.description || !updateData.code || !updateData.price || !updateData.stock || !updateData.category) {
            throw new Error('faltan campos');
        }

        return await this.productRepository.update(id, updateData);
    }

    async delete(id) {
        const product = await this.getBy({ _id: id });
        return await this.productRepository.delete(id);
    }
}
