import { logger } from "../utils/logger.js";
import { sendEmailMessage } from '../utils/sendEmailMessage.js';


export default class RealTimeProductsService {
    constructor(productRepository, userService) {
        this.productRepository = productRepository;
        this.userService = userService;
    }

    async createProduct(title, description, code, price, status = true, stock, category, thumbnails, user) {
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Faltan campos');
        }
        const products = await this.productRepository.getProducts();
        const productWithSameCode = products.docs.find((prod) => prod.code === code);
        if (productWithSameCode) {
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

        newProduct.owner = user.role === 'premium' ? user.email : 'admin';
        return await this.productRepository.createProduct(newProduct);
    }


    async getProducts() {
        return await this.productRepository.getProducts();
    }

    async getProductBy(filter) {
        const product = await this.productRepository.getProductBy(filter);
        if (!product) {
            throw new Error(`¡ERROR! No existe ningún producto con el id ${filter._id}`);
        }
        return product;
    }

    async updateProduct(productId, productToUpdate) {
        return await this.productRepository.updateProduct(productId, productToUpdate);

    }

    async deleteProduct(productId) {
        const deletedProduct = await this.productRepository.getProductBy({ _id: productId });
        const productOwner = deletedProduct.owner;
        const user = await this.userService.getUserBy({ email: productOwner });

        if (user.role === 'premium') {
            sendEmailMessage({
                email: user.email,
                subject: 'Producto eliminado de la base de datos',
                html: `
                    <h1>Hola! ${user.first_name} ${user.last_name}</h1>
                    <h2>Tu producto ${deletedProduct.title} fue eliminado de la base de datos</h2>
                `
            });
        }
        return await this.productRepository.deleteProduct(productId);
    };
}