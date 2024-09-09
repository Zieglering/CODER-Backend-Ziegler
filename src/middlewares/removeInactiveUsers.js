import { sendEmailMessage } from "../utils/sendEmailMessage.js";
import { logger } from "../utils/logger.js";
import { userService } from "../service/service.js";

const removeUsersAfterThisTime = 1000 * 60 * 60 * 24 * 2;

function formatTime(ms) {
    const segundos = Math.floor((ms / 1000) % 60);
    const minutos = Math.floor((ms / (1000 * 60)) % 60);
    const horas = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const dias = Math.floor(ms / (1000 * 60 * 60 * 24));

    return `${dias}Días ${horas}Horas ${minutos}Minutos ${segundos}Segundos`;
}


const removeInactiveUsers = async () => {
    const formattedTime = formatTime(removeUsersAfterThisTime);

    try {

        const users = await userService.getUsers();
        logger.info(users);
        const dateNow = new Date();
        logger.info(dateNow);

        users.forEach(async (user) => {
            const lastConnectionDate = new Date(user.last_connection);
            const diffTime = dateNow - lastConnectionDate;

            if (diffTime > removeUsersAfterThisTime) {
                await sendEmailMessage({
                    email: user.email,
                    subject: 'Tu cuenta fue eliminada por estar inactiva',
                    html: `
                        <h1>Hola, ${user.first_name} ${user.last_name}</h1>
                        <p>Tu cuenta ${user.email} ha sido eliminada debido a inactividad de ${formattedTime}.</p>
                    `
                });
                await userService.deleteUser(user._id);
                logger.info(`El usuario ${user.email} fue eliminado por permanecer inactivo durante ${formattedTime}.`);
            }
        });
    } catch (error) {
        logger.error(`Error al intentar borrar usuario inactivo: ${error}`);
    }
};

export const InactiveUsersCheck = () => {
    const checkForInactiveUsersEvery = 1000 * 60 * 60;
    const formattedTime = formatTime(checkForInactiveUsersEvery);

    setInterval(() => {
        logger.info(`Eliminando usuarios que permanecieron inactivos por mas de ${formattedTime}`);
        removeInactiveUsers();
    }, checkForInactiveUsersEvery);
};

export default removeInactiveUsers;