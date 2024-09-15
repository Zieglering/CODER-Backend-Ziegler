import { logger } from "./logger.js";
import { realTimeProductsService } from "../service/service.js";

export const realTimeProducts = (io) => {
    io.on("connection", async (socket) => {
        logger.info('Cliente conectado');
        const products = await realTimeProductsService.getProducts();
        socket.emit("getProducts", products);
        socket.on("createProduct", async (newProductData, user) => {
            try {
                await realTimeProductsService.createProduct(
                    newProductData.title,
                    newProductData.description,
                    newProductData.code,
                    newProductData.price,
                    newProductData.status,
                    newProductData.stock,
                    newProductData.category,
                    newProductData.thumbnails,
                    user
                );

                io.emit("getProducts", await realTimeProductsService.getProducts());
                socket.emit("productCreated", { success: true });
            } catch (error) {
                socket.emit("productCreated", { success: false, message: 'Error al crear el producto.' });
            }
        });

        socket.on("updateProduct", async (productId, updatedProductData) => {
            try {
                await realTimeProductsService.updateProduct(productId, updatedProductData);

                io.emit("getProducts", await realTimeProductsService.getProducts());
                socket.emit("productUpdated", { success: true });
            } catch (error) {
                socket.emit("productUpdated", { success: false, message: error.message });
            }
        });

        socket.on("deleteProduct", async (productID) => {
            try {
                await realTimeProductsService.deleteProduct(productID);

                io.emit("getProducts", await realTimeProductsService.getProducts());
                socket.emit("productDeleted", { success: true });
            } catch (error) {
                logger.error("Error borrando el producto:", error);
                socket.emit("productDeleted", { success: false, message: error.message });
            }
        });
    });
};
