import { realTimeProductsService } from "../service/service.js";

class RealTimeProductController {
    constructor() {
        this.realTimeProductsService = realTimeProductsService;
    }

    createRealTimeProduct = async (req, res) => {
        try {
            const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
            const newProduct = await this.realTimeProductsService.create(title, description, code, price, status, stock, category, thumbnails);
            res.status(201).send({ status: 'success', payload: newProduct });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    getRealTimeProducts = async (req, res) => {
        try {
            const products = await this.realTimeProductsService.getProducts();
            res.status(200).send({ status: 'success', payload: products });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    getRealTimeProductBy = async (req, res) => {
        const { pid } = req.params;
        try {
            const productFound = await this.realTimeProductsService.getBy({ _id: pid });
            res.status(200).send({ status: 'success', payload: productFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    updateRealTimeProduct = async (req, res) => {
        const { pid } = req.params;
        const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
        try {
            const updatedProduct = await this.realTimeProductsService.update(pid, { title, description, code, price, status, stock, category, thumbnails });
            res.status(201).send({ status: 'success', payload: updatedProduct });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    removeRealTimeProduct = async (req, res) => {
        const { pid } = req.params;
        try {
            await this.realTimeProductsService.remove(pid);
            res.status(200).send({ status: 'success', payload: `El producto con id ${pid} ha sido eliminado` });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };
}

export default RealTimeProductController;
