import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import {
  globalErrHandler,
  notFoundErr,
} from "@/middlewares/globalErrHandler.middleware";
import refreshTokenMiddleware from "@/middlewares/refreshToken.middleware";
import routes from "@/routes/routes";

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
