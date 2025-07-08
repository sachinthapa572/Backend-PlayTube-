import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import routes from "../routes/routes.js";
import {
  globalErrHandler,
  notFoundErr,
} from "../middlewares/globalErrHandler.middleware.js";
import refreshTokenMiddleware from "../middlewares/refreshToken.middleware.js";

const app = express();

// ==> 	middelwares	 <==
app.use(morgan("tiny"));
app.use(cors());
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(refreshTokenMiddleware);

// ROUTES
app.use("/api/v1/", routes);

app.use(globalErrHandler);
app.use(notFoundErr);

export default app;
