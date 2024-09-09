import { EError } from "../../service/errors/enums.js";
import { logger } from "../../utils/logger.js";

export const handleErrors = (error, req, res, next) => {
    logger.error(`Error: ${error.message}`);

    if (error.cause) {
        logger.error(`Causa: ${error.cause}`);
    }

    switch (error.code) {
        case EError.MISSING_OR_INVALID_REQUIRED_DATA_ERROR:
            return res.status(400).send({ status: 'error', error: 'Faltan datos o son inválidos', details: error.cause });

        case EError.INVALID_TYPES_ERROR:
            return res.status(400).send({ status: 'error', error: 'Tipo de dato inválido', details: error.cause });

        case EError.DATABASE_ERROR:
            return res.status(500).send({ status: 'error', error: 'Error en la base de datos', details: error.cause });

        case EError.ROUTING_ERROR:
            return res.status(404).send({ status: 'error', error: 'Ruta no encontrada', details: error.cause });

        default:
            logger.error('Error inesperado:', error);
            return res.status(500).send({ status: 'error', error: 'Error inesperado. Vuelve a intentarlo más tarde' });
    }
};
