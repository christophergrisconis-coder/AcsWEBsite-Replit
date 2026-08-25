import { Router, type IRouter, type Request, type Response } from "express";
import { logger } from "../lib/logger";
import { buildCapabilitiesPdf } from "../lib/capabilities-pdf";

const router: IRouter = Router();

router.get(
  "/partner-resources/capabilities.pdf",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const pdf = await buildCapabilitiesPdf();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="ACS-Partner-Capabilities.pdf"',
      );
      res.setHeader("Cache-Control", "public, max-age=300");
      res.status(200).send(pdf);
    } catch (err) {
      logger.error({ err }, "Failed to generate capabilities PDF");
      res.status(500).json({ error: "Failed to generate capabilities PDF" });
    }
  },
);

export default router;
