import { logger } from "../utils/logger.js";

export const startServer = (httpServer, port) => {
    httpServer.listen(port, (error) => {
        if (error) {
            return logger.error(`Error al iniciar el servidor: ${error}`);
        }
        logger.info(`Server escuchando en el puerto ${port}`);
    });
};