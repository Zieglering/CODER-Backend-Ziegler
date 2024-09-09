import { CustomError } from '../service/errors/CustomError.js';
import { EError } from '../service/errors/enums.js';
import { generateInvalidProductError } from '../service/errors/info.js';
import { sendEmailMessage } from '../utils/sendEmailMessage.js';

export default class ProductService {
    constructor(productRepository, userService) {
        this.productRepository = productRepository;
        this.userService = userService;
    }

    createProduct = async (product, user) => {
        const { title, description, code, price, status = true, stock, category } = product;

        try {
            if (!title || !description || !code || !price || !stock || !category) {
                throw CustomError.createError({
                    name: 'Error al crear el producto',
                    cause: generateInvalidProductError({ title, description, code, price, stock, category }),
                    message: 'Error al crear el producto, campos faltantes o inválidos',
                    code: EError.MISSING_OR_INVALID_REQUIRED_DATA_ERROR
                });
            }

            const existingProducts = await this.productRepository.getProducts();
            if (existingProducts.docs.find((prod) => prod.code === code)) {
                throw CustomError.createError({
                    name: 'Error al crear el producto',
                    cause: generateInvalidProductError({ title, description, code, price, stock, category }),
                    message: `No se pudo crear el producto con el código ${code} porque ya existe un producto con ese código`,
                    code: EError.MISSING_OR_INVALID_REQUIRED_DATA_ERROR
                });
            }
            product.owner = user.role === 'premium' ? user.email : 'admin';
            return await this.productRepository.createProduct(product);

        } catch (error) {
            throw CustomError.createError({
                name: 'Error al crear el producto',
                cause: generateInvalidProductError({ title, description, code, price, stock, category }),
                message: `No se pudo crear el producto: ${error}`,
                code: EError.MISSING_OR_INVALID_REQUIRED_DATA_ERROR
            });
        }
    };

    getProducts = async (filter) => {
        return await this.productRepository.getProducts(filter);
    };

    getProduct = async (filter) => {
        return await this.productRepository.getProduct(filter);
    };

    updateProduct = async (productId, productToUpdate) => {
        return await this.productRepository.updateProduct(productId, productToUpdate);
    };

    deleteProduct = async (productId) => {
        const deletedProduct = await this.getProduct({ _id: productId });
        const productOwner = deletedProduct.owner;
        const user = await userService.getUserBy({ email: productOwner });

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