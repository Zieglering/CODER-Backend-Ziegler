import { realTimeProductsService } from "../service/service.js";

class RealTimeProductController {
    constructor() {
        this.realTimeProductsService = realTimeProductsService;
    }

    createRealTimeProduct = async (req, res) => {
        try {
            const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
            const products = await realTimeProductsService.getAll();

            if (!title || !description || !code || !price || !stock || !category)
                return res.status(400).send({ status: 'error', error: 'Faltan campos' });

            if (products.find((prod) => prod.code === code))
                return res.status(400).send({ status: 'error', error: `No se pudo agregar el producto con el código ${code} porque ya existe un producto con ese código` });

            const newProduct = await realTimeProductsService.create(title, description, code, price, status, stock, category, thumbnails);
            res.status(201).send({ status: 'success', payload: newProduct });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    getRealTimeProducts = async (req = {}, res) => {
        try {
            const limit = req.query?.limit;
            const products = await realTimeProductsService.getProducts();

            if (limit) {
                const limitedProducts = products.slice(0, parseInt(limit));
                if (res) return res.status(200).send({ status: 'success', payload: limitedProducts });
                return limitedProducts;
            }
            if (res) return res.status(200).send({ status: 'success', payload: products });
            return products;
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    getRealTimeProductBy = async (req, res) => {
        const { pid } = req.params;
        const productFound = await realTimeProductsService.getBy({ _id: pid });
        try {
            if (!productFound)
                return res.status(400).send({ status: 'error', error: `¡ERROR! No existe ningún producto con el id ${pid}` });

            res.status(200).send({ status: 'success', payload: productFound });

        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    updateRealTimeProduct = async (req, res) => {
        const { pid } = req.params;
        const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
        const productFound = await realTimeProductsService.getBy({ _id: pid });
        try {
            if (!title || !description || !code || !price || !stock || !category) {
                return res.status(400).send({ status: 'error', error: 'faltan campos' });
            }

            if (!productFound) return res.status(400).send({ status: 'error', error: `No existe el producto con el id ${pid}` });

            const updatedProduct = await realTimeProductsService.update(pid, { title, description, code, price, status, stock, category, thumbnails });
            res.status(201).send({ status: 'success', payload: updatedProduct });

        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    removeRealTimeProduct = async (req, res) => {
        const { pid } = req.params;
        const productFound = await realTimeProductsService.getBy({ _id: pid });
        try {
            if (!productFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe ningún producto con el id ${pid}` });

            res.status(200).send({ status: 'success', payload: productFound });
            realTimeProductsService.remove(pid);

        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };
}

export default RealTimeProductController;