import { Router } from "express";
import { requireRoles } from "../../middleware/auth.js";
import { parse } from "../../middleware/validate.js";
import { idParam } from "../../lib/schemas.js";
import { campaignCreateBody, listCampaignsQuery } from "./campaigns.schema.js";
import * as campaigns from "./campaigns.service.js";

export const campaignsRouter = Router();

const canRead = requireRoles("ADMIN", "KE_TOAN", "TRUONG_BQT");
const canWrite = requireRoles("KE_TOAN", "ADMIN");

campaignsRouter.get("/", canRead, async (req, res) => {
  res.json(await campaigns.listCampaigns(parse(listCampaignsQuery, req.query)));
});

campaignsRouter.post("/", canWrite, async (req, res) => {
  res.status(201).json(await campaigns.createCampaign(parse(campaignCreateBody, req.body)));
});

campaignsRouter.get("/:campaignId", canRead, async (req, res) => {
  res.json(await campaigns.getCampaign(parse(idParam, req.params.campaignId, "campaignId")));
});
