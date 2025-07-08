import { Router } from "express";
import userRouter from "./user/user.routes.js";

const routes = Router();

routes.use("/users", userRouter);

export default routes;
