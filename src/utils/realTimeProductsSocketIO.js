import { logger } from "./logger.js";
import { realTimeProductsService } from "../service/service.js";

export const realTimeProducts = (io) => {
    io.on("connection", async (socket) => {
        const { role, email } = socket.handshake.query;
        let products = await realTimeProductsService.getProducts({limit:999999});

        if (role === 'premium') {
            products = products.docs.filter(product => product.owner === email);
        } else if (role === 'admin') {
            products = products.docs
        }
        socket.emit("getProducts", { docs: products });
        socket.on("createProduct", async (newProductData, user) => {
            try {
                await realTimeProductsService.createProduct(newProductData, user);
                let updatedProducts = await realTimeProductsService.getProducts({limit:999999});

                if (role === 'admin') {
                    updatedProducts = updatedProducts.docs;
                } else if (role === 'premium') {
                    updatedProducts = updatedProducts.docs.filter(product => product.owner === email);
                }
                
                io.emit("getProducts", { docs: updatedProducts });
                socket.emit("productCreated", { success: true });
            } catch (error) {
                socket.emit("productCreated", { success: false, message: error.message });
            }
        });

        socket.on("updateProduct", async (productId, updatedProductData) => {
            try {
                await realTimeProductsService.updateProduct(productId, updatedProductData);
                let updatedProducts = await realTimeProductsService.getProducts({limit:999999});

                if (role === 'admin') {
                    updatedProducts = updatedProducts;
                } else if (role === 'premium') {
                    updatedProducts = updatedProducts.docs.filter(product => product.owner === email);
                }

                io.emit("getProducts", { docs: updatedProducts });
                socket.emit("productUpdated", { success: true });
            } catch (error) {
                socket.emit("productUpdated", { success: false, message: error.message });
            }
        });

        socket.on("deleteProduct", async (productId) => {
            try {
                await realTimeProductsService.deleteProduct(productId);
                let updatedProducts = await realTimeProductsService.getProducts({limit:999999});

                if (role === 'admin') {
                    updatedProducts = updatedProducts;
                } else if (role === 'premium') {
                    updatedProducts = updatedProducts.docs.filter(product => product.owner === email);
                }

                io.emit("getProducts", { docs: updatedProducts });
                socket.emit("productDeleted", { success: true });
            } catch (error) {
                socket.emit("productDeleted", { success: false, message: error.message });
            }
        });
    });
};
