import { Router, type IRouter, type Request, type Response } from "express";
import { SubmitBriefingRequestBody } from "@workspace/api-zod";
import { pool } from "@workspace/db";
import { logger } from "../lib/logger";
import { notifyBriefingRequest } from "../lib/notify-briefing";
import { requireAdminToken } from "../lib/admin-auth";
import { randomUUID } from "crypto";

const router: IRouter = Router();

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REVIEW_STATUSES = new Set(["new", "reviewed", "archived"]);

router.post("/briefing-requests", async (req, res) => {
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
  const messageValue = message?.trim() ? message.trim() : null;

  try {
    await pool.query(
      `INSERT INTO briefing_requests
         (id, agency_name, program_interest, contact_name, contact_email, message, notification_status, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', 'new')`,
      [id, agencyName, programInterest, contactName, contactEmail, messageValue],
    );
  } catch (err) {
    logger.error({ err, briefingRequestId: id }, "Failed to store briefing request");
    res.status(500).json({ error: "Failed to store briefing request" });
    return;
  }

  const notification = await notifyBriefingRequest({
    id,
    agencyName,
    programInterest,
    contactName,
    contactEmail,
    message: messageValue ?? undefined,
  });

  try {
    await pool.query(
      `UPDATE briefing_requests
       SET notification_status = $2,
           notification_error = $3,
           notified_at = CASE WHEN $2 = 'sent' THEN NOW() ELSE notified_at END
       WHERE id = $1`,
      [
        id,
        notification.status,
        notification.status === "failed" ? notification.detail : null,
      ],
    );
  } catch (err) {
    logger.error(
      { err, briefingRequestId: id, notification },
      "Stored briefing request but failed to update notification status",
    );
  }

  logger.info(
    {
      briefingRequestId: id,
      agencyName,
      programInterest,
      contactName,
      contactEmail,
      messageLength: messageValue?.length ?? 0,
      notificationStatus: notification.status,
    },
    "Briefing request received",
  );

  res.status(201).json({ success: true, id });
});

router.get(
  "/briefing-requests",
  requireAdminToken,
  async (req: Request, res: Response): Promise<void> => {
    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;
    if (status && !REVIEW_STATUSES.has(status)) {
      res.status(400).json({
        error: "Validation failed",
        details: ["status must be one of: new, reviewed, archived"],
      });
      return;
    }

    try {
      const result = status
        ? await pool.query(
            `SELECT id, agency_name, program_interest, contact_name, contact_email,
                    message, notification_status, notification_error, notified_at,
                    status, created_at
             FROM briefing_requests
             WHERE status = $1
             ORDER BY created_at DESC
             LIMIT 200`,
            [status],
          )
        : await pool.query(
            `SELECT id, agency_name, program_interest, contact_name, contact_email,
                    message, notification_status, notification_error, notified_at,
                    status, created_at
             FROM briefing_requests
             ORDER BY created_at DESC
             LIMIT 200`,
          );

      res.status(200).json({
        requests: result.rows.map((row) => ({
          id: row.id,
          agencyName: row.agency_name,
          programInterest: row.program_interest,
          contactName: row.contact_name,
          contactEmail: row.contact_email,
          message: row.message,
          notificationStatus: row.notification_status,
          notificationError: row.notification_error,
          notifiedAt: row.notified_at,
          status: row.status,
          createdAt: row.created_at,
        })),
      });
    } catch (err) {
      logger.error({ err }, "Failed to list briefing requests");
      res.status(500).json({ error: "Failed to list briefing requests" });
    }
  },
);

router.patch(
  "/briefing-requests/:id",
  requireAdminToken,
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const status = req.body?.status;
    if (typeof status !== "string" || !REVIEW_STATUSES.has(status)) {
      res.status(400).json({
        error: "Validation failed",
        details: ["status must be one of: new, reviewed, archived"],
      });
      return;
    }

    try {
      const result = await pool.query(
        `UPDATE briefing_requests
         SET status = $2
         WHERE id = $1
         RETURNING id, status`,
        [id, status],
      );
      if (!result.rowCount) {
        res.status(404).json({ error: "Briefing request not found" });
        return;
      }
      res.status(200).json({
        success: true,
        id: result.rows[0].id,
        status: result.rows[0].status,
      });
    } catch (err) {
      logger.error({ err, briefingRequestId: id }, "Failed to update briefing request");
      res.status(500).json({ error: "Failed to update briefing request" });
    }
  },
);

export default router;
