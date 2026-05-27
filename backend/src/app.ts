import express from "express";
import cors from "cors";
import { materialRouter, orderRouter, settingsRouter } from "./routes";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { limiter } from "./helpers/rateLimit";

const app = express();
const DB_URL =
  process.env.NODE_ENV === "test"
    ? "mongodb://localhost:27018/3d-dashboard-test"
    : process.env.DB_URL_DEV || "mongodb://localhost:27018/3d-dashboard";

mongoose
  .connect(DB_URL)
  .then(() => console.log(`Connected to database: ${DB_URL}`))
  .catch((error) =>
    console.error(`Error connecting to database: ${error.message}`),
  );

app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "prod"
        ? ["https://tu-dominio-production.com"]
        : ["http://localhost:4200"],
  }),
);

if (process.env.NODE_ENV === "prod") {
  app.use(compression());
  app.use(limiter);
}
app.use(express.json());

app.use("/api/materials", materialRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/orders", orderRouter);

export default app;
