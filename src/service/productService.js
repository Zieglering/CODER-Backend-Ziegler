import { CustomError } from '../service/errors/CustomError.js';
import { EError } from '../service/errors/enums.js';
import { generateInvalidProductError } from '../service/errors/info.js';
import { logger } from '../utils/logger.js';


export default class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
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
                throw new Error(`No se pudo agregar el producto con el código ${code} porque ya existe un producto con ese código`);
            }
    
            product.owner = user.role === 'premium' ? user.email : 'admin';
            return await this.productRepository.createProduct(product);
            
        } catch (error) {
            throw new Error(error)
        }
    }

    getProducts = async (filter) => {
        return await this.productRepository.getProducts(filter);
    }

    getProduct = async (filter) => {
        return await this.productRepository.getProduct(filter);
    }

    updateProduct = async (pid, productToUpdate) => {
        return await this.productRepository.updateProduct(pid, productToUpdate);
    }

    deleteProduct = async (pid) => {
        return await this.productRepository.deleteProduct(pid);
    }
}