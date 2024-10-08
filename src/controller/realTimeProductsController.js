import { realTimeProductsService } from "../service/service.js";
import { logger } from "../utils/logger.js";

class RealTimeProductController {
    constructor() {
        this.realTimeProductsService = realTimeProductsService;
    }

    createRealTimeProduct = async (req, res) => {
        try {
            const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
            const newProduct = await this.realTimeProductsService.createProduct(title, description, code, price, status, stock, category, thumbnails);
            res.status(201).send({ status: 'success', payload: newProduct });
        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al crear el producto: ${error.message}` });
        }
    };

    getRealTimeProducts = async (req, res) => {
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

    getRealTimeProductBy = async (req, res) => {
        const { pid } = req.params;
        try {
            const productFound = await this.realTimeProductsService.getProductBy({ _id: pid });
            res.status(200).send({ status: 'success', payload: productFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al buscar el producto: ${error.message}` });
        }
    };

    updateRealTimeProduct = async (req, res) => {
        const { pid } = req.params;
        console.log("Update Product ID: ", pid);
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;

        const productFound = await this.realTimeProductsService.getProductBy({ _id: pid });
        try {
            if (!title || !description || !code || !price || !stock || !category) {
                return res.status(400).send({ status: 'error', error: `Error, faltan campos: ${error.message}` });
            }

            if (!productFound) return res.status(400).send({ status: 'error', error: `Error, no existe el producto: ${error.message}` });

            const updatedProduct = await this.realTimeProductsService.updateProduct(pid, { title, description, code, price, status, stock, category, thumbnails });
            res.status(201).send({ status: 'success', payload: updatedProduct });

        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al intentar actualizar el producto: ${error.message}` });
        }
    };
    
    deleteRealTimeProduct = async (req, res) => {
        const { pid } = req.params;
        console.log("Delete Product ID: ", pid);

        const user = req.user;

        try {
            const productFound = await this.realTimeProductsService.getProductBy({ _id: pid });
            if (!productFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe ningún producto con el id ${pid}` });
            if (user.role === 'premium' && productFound.owner !== user.email) return res.status(401).send({ status: 'error', error: `el producto ${productFound.title} no le pertenece a ${user.email}, por lo tanto no puede borrarlo` });

            await this.realTimeProductsService.deleteProduct(pid);
            res.status(200).send({ status: 'success', payload: productFound });

        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error al borrar el producto: ${error.message}` });
        }
    };
}

export default RealTimeProductController;