import express from "express";
import { authenticate } from "./middleware/auth.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { feesRouter } from "./modules/fees/fees.routes.js";
import { campaignsRouter } from "./modules/campaigns/campaigns.routes.js";

export const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", authenticate);
app.use("/api/fees", feesRouter);
app.use("/api/contribution-campaigns", campaignsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
