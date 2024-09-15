import { sendEmailMessage } from "./sendEmailMessage.js";
import { logger } from "./logger.js";
import { userService } from "../service/service.js";
import __dirname from "./filenameUtils.js";
import { connectMongoDb } from "../config/mongoDB.config.js";

// Eliminar usuarios luego de permanecer inactivos por este tiempo en milisegundos
const removeUsersAfterThisTime = 1000 * 60 * 60 * 24 * 2;

// Chequear usuarios inactivos cada este tiempo en milisegundos
const checkForInactiveUsersEvery = 1000 * 60 * 60;

function formatTime(ms) {
    const segundos = Math.floor((ms / 1000) % 60);
    const minutos = Math.floor((ms / (1000 * 60)) % 60);
    const horas = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const dias = Math.floor(ms / (1000 * 60 * 60 * 24));
    return `${dias} Días ${horas} Horas ${minutos} Minutos ${segundos} Segundos`;
}

const removeInactiveUsers = async () => {
    try {
        logger.info("Buscando usuarios inactivos...");

        const users = await userService.getUsers();
        const dateNow = new Date();
        let usersRemoved = 0;

        for (const user of users.docs) {
            const lastConnectionDate = new Date(user.last_connection || null);
            const diffTime = dateNow - lastConnectionDate;

            if (user.last_connection && diffTime > removeUsersAfterThisTime) {
                await sendEmailMessage({
                    email: user.email,
                    subject: 'Tu cuenta fue eliminada por estar inactiva',
                    html: `
                        <h1>Hola, ${user.first_name} ${user.last_name}</h1>
                        <p>Tu cuenta ${user.email} ha sido eliminada debido a inactividad de ${formatTime(diffTime)}.</p>
                    `,
                });
                await userService.deleteUser({ _id: user._id });
                logger.info(`El usuario ${user.email} fue eliminado por permanecer inactivo durante ${formatTime(diffTime)}.`);
                usersRemoved++;
            }
        }

        if (usersRemoved > 0) {
            logger.info(`${usersRemoved} Usuarios inactivos eliminados.`);
            process.send({ type: 'removeInactiveUser', message: `${usersRemoved} usuarios eliminados` });
        } else {
            process.send({ type: 'removeInactiveUser', message: 'No se elimino ningún usuario, porque no hay usuarios inactivos,' });
        }
    } catch (error) {
        logger.error(`Error al intentar eliminar usuarios inactivos: ${error.message}`);
        process.send({ type: 'error', message: `Error: ${error.message}` });
    }
};

const startCheckingInactiveUsers = () => {
    logger.info("Iniciando la búsqueda de usuarios inactivos...");
    setInterval(() => {
        removeInactiveUsers();
    }, checkForInactiveUsersEvery);
};

process.on('message', async (message) => {
    if (message === 'iniciar_busqueda_de_usuarios_inactivos') {
        await connectMongoDb();
        startCheckingInactiveUsers();
    }
});