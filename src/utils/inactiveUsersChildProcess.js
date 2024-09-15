import { fork } from "child_process";
import { logger } from "./logger.js";
import __dirname from "./filenameUtils.js";

export const inactiveUserChildProcess = () => {
    const childScript = `${__dirname}/utils/removeInactiveUsers.js`;
    const inactiveUsersChild = fork(childScript);

    inactiveUsersChild.on('message', (result) => {
        if (result.type === 'removeInactiveUser' || result.type === 'error') {
            logger.info(`Mensaje del child process de busca de usuarios inactivos: ${result.message}`);
        }
    });

    inactiveUsersChild.on('error', (error) => {
        logger.error(`Error en el child process de busca de usuarios inactivos: ${error.message}`);
    });

    inactiveUsersChild.on('exit', (code) => {
        logger.info(`Busca de usuarios inactivos exit code ${code}`);
    });

    inactiveUsersChild.send('iniciar_busqueda_de_usuarios_inactivos');
};