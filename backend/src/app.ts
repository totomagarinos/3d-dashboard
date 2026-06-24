import express from "express";
import { authRouter, materialRouter, orderRouter, settingsRouter } from "./routes";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { limiter } from "./helpers/rateLimit";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const DB_URL =
  process.env.NODE_ENV === "test"
    ? "mongodb://localhost:27018/3d-dashboard-test"
    : process.env.DB_URL || "mongodb://localhost:27018/3d-dashboard";

mongoose
  .connect(DB_URL)
  .then(() => console.log(`Connected to database: ${DB_URL}`))
  .catch((error) =>
    console.error(`Error connecting to database: ${error.message}`),
  );

const allowedOrigins =
  process.env.NODE_ENV === "prod"
    ? ["http://localhost"]
    : ["http://localhost:4200"];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(morgan("dev"));
app.use(helmet());

if (process.env.NODE_ENV === "prod") {
  app.use(compression());
  app.use(limiter);
}
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/materials", materialRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/orders", orderRouter);

app.use(errorHandler);

export default app;
