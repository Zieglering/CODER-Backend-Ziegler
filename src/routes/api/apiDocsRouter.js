import { Router } from 'express';
import swaggerJsDocs from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { authorizationJwt } from '../../utils/authorizationJwt.js';
import { passportCall } from '../../utils/passportCall.js';
import swaggerOptions from "../../config/swaggerConfig.js";

const router = Router();
const specs = swaggerJsDocs(swaggerOptions);

router.use('/', passportCall('jwt'), authorizationJwt('admin', 'premium'), swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

export default router;