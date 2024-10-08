import { productService, userService } from '../service/service.js';
import ProductDTO from '../dtos/ProductDTO.js';

class ProductController {
    constructor() {
        this.productService = productService;
        this.userService = userService;
    }

    createProduct = async (req, res, next) => {
        const product = req.body
        const user = req.user
        try {
            const newProduct = await productService.createProduct(product, user);
            return res.status(201).json({ status: 'success', payload: new ProductDTO(newProduct, user) });
        } catch (error) {
            next(error);
        }
    };

    getProducts = async (req, res) => {
        try {
            const { limit = 10, pageNum = 1, category, status, product: title, sortByPrice } = req.query;
            const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } = await productService.getProducts({ limit, pageNum, category, status, title, sortByPrice });

            let prevLink = null;
            let nextLink = null;

            if (hasPrevPage) {
                prevLink = `/index?pageNum=${prevPage}`;
                if (limit) prevLink += `&limit=${limit}`;
                if (title) prevLink += `&product=${title}`;
                if (category) prevLink += `&category=${category}`;
                if (status) prevLink += `&status=${status}`;
                if (sortByPrice) prevLink += `&sortByPrice=${sortByPrice}`;
            }

            if (hasNextPage) {
                nextLink = `/index?pageNum=${nextPage}`;
                if (limit) nextLink += `&limit=${limit}`;
                if (title) nextLink += `&product=${title}`;
                if (category) nextLink += `&category=${category}`;
                if (status) nextLink += `&status=${status}`;
                if (sortByPrice) nextLink += `&sortByPrice=${sortByPrice}`;
            }

            res.status(200).send({
                status: 'success',
                payload: {
                    products: docs,
                    totalPages,
                    prevPage,
                    nextPage,
                    page,
                    hasPrevPage,
                    hasNextPage,
                    prevLink,
                    nextLink
                }
            });
        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al buscar los productos: ${error.message}` });
        }
    };

    getProductBy = async (req, res) => {
        const { pid } = req.params;
        const productFound = await productService.getProductBy({ _id: pid });
        try {
            if (!productFound)
                return res.status(400).send({ status: 'error', error: `¡ERROR! No existe ningún producto con el id ${pid}` });

            res.status(200).send({ status: 'success', payload: productFound });

        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al buscar el producto: ${error.message}` });
        }
    };

    updateProduct = async (req, res) => {
        const { pid } = req.params;
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;

        const productFound = await productService.getProductBy({ _id: pid });
        try {
            if (!title || !description || !code || !price || !stock || !category) {
                return res.status(400).send({ status: 'error', error: `Error, faltan campos: ${error.message}` });
            }

            if (!productFound) return res.status(400).send({ status: 'error', error: `Error, no existe el producto: ${error.message}` });

            const updatedProduct = await productService.updateProduct(pid, { title, description, code, price, status, stock, category, thumbnails });
            res.status(201).send({ status: 'success', payload: updatedProduct });

        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al intentar actualizar el producto: ${error.message}` });
        }
    };

    deleteProduct = async (req, res) => {
        const { pid } = req.params;
        const user = req.user;

        try {
            const productFound = await productService.getProductBy({ _id: pid });
            if (!productFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe ningún producto con el id ${pid}` });
            if (user.role === 'premium' && productFound.owner !== user.email) return res.status(401).send({ status: 'error', error: `el producto ${productFound.title} no le pertenece a ${user.email}, por lo tanto no puede borrarlo` });

            await productService.deleteProduct(pid);
            res.status(200).send({ status: 'success', payload: productFound });

        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al borrar el producto: ${error.message}` });
        }
    };
}

export default ProductController;