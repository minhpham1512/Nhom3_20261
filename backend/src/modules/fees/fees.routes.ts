import { Router } from "express";
import { requireRoles } from "../../middleware/auth.js";
import { parse } from "../../middleware/validate.js";
import { idParam } from "../../lib/schemas.js";
import { feeCreateBody, feeStatusBody, feeUpdateBody, listFeesQuery } from "./fees.schema.js";
import * as fees from "./fees.service.js";

export const feesRouter = Router();

const canRead = requireRoles("ADMIN", "KE_TOAN", "TRUONG_BQT");
const canWrite = requireRoles("KE_TOAN", "ADMIN");

feesRouter.get("/", canRead, async (req, res) => {
  res.json(await fees.listFees(parse(listFeesQuery, req.query)));
});

feesRouter.post("/", canWrite, async (req, res) => {
  const fee = await fees.createFee(parse(feeCreateBody, req.body), req.user!.id);
  res.status(201).json(fee);
});

feesRouter.get("/:feeId", canRead, async (req, res) => {
  res.json(await fees.getFee(parse(idParam, req.params.feeId, "feeId")));
});

feesRouter.patch("/:feeId", canWrite, async (req, res) => {
  const id = parse(idParam, req.params.feeId, "feeId");
  res.json(await fees.updateFee(id, parse(feeUpdateBody, req.body), req.user!.id));
});

feesRouter.get("/:feeId/prices", canRead, async (req, res) => {
  res.json(await fees.listFeePrices(parse(idParam, req.params.feeId, "feeId")));
});

feesRouter.patch("/:feeId/status", canWrite, async (req, res) => {
  const id = parse(idParam, req.params.feeId, "feeId");
  res.json(await fees.updateFeeStatus(id, parse(feeStatusBody, req.body).status));
});
