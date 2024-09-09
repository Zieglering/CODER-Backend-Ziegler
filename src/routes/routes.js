import { Router } from "express";
import viewsRouter from "./viewsRouter.js";
import { sessionsRouter } from "./api/sessionsRouter.js";
import productsRouter from "./api/productsRouter.js";
import usersRouter from "./api/usersRouter.js";
import cartsRouter from "./api/cartsRouter.js";
import realtimeproductsRouter from "./api/realtimeproductsRouter.js";
import chatRouter from "./api/chatsRouter.js";
import apiDocsRouter from "./api/apiDocsRouter.js";
import pruebasRouter from "./api/pruebasRouter.js";
import notFoundRouter from "./api/notFoundRouter.js";

const router = Router();

router.use("/", viewsRouter);
router.use("/api/sessions", sessionsRouter);
router.use("/api/products", productsRouter);
router.use("/api/users", usersRouter);
router.use("/api/carts", cartsRouter);
router.use("/realtimeproducts", realtimeproductsRouter);
router.use("/chat", chatRouter);
router.use("/apidocs", apiDocsRouter);
router.use("/pruebas", pruebasRouter);
router.use("*", notFoundRouter);

export default router;