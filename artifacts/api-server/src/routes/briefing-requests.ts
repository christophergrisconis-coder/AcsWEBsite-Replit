import { Router, type IRouter } from "express";
import { SubmitBriefingRequestBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { randomUUID } from "crypto";

const router: IRouter = Router();

// Simple email pattern — the generated zod schema only checks string; we
// validate format here so the frontend gets a clear 400 on bad input.
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/briefing-requests", (req, res) => {
  // Parse and validate the body against the generated schema
  const result = SubmitBriefingRequestBody.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Validation failed",
      details: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
    return;
  }

  const { agencyName, programInterest, contactName, contactEmail, message } =
    result.data;

  if (!emailRe.test(contactEmail)) {
    res.status(400).json({
      error: "Validation failed",
      details: ["contactEmail: must be a valid email address"],
    });
    return;
  }

  const id = randomUUID();

  // Log the submission so it's visible in server logs. A future task can
  // forward this to a CRM or email service (see task list).
  logger.info(
    {
      briefingRequestId: id,
      agencyName,
      programInterest,
      contactName,
      contactEmail,
      messageLength: message?.length ?? 0,
    },
    "Briefing request received",
  );

  res.status(201).json({ success: true, id });
});

export default router;
