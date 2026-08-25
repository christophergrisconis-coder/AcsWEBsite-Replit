import {
  Router,
  type IRouter,
  type Request,
  type Response,
} from "express";
import { db, partnerProofsTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { requireAdminToken } from "../lib/admin-auth";

const router: IRouter = Router();


function serializeProof(proof: typeof partnerProofsTable.$inferSelect) {
  return {
    id: proof.id,
    kind: proof.kind,
    title: proof.title,
    quote: proof.quote ?? undefined,
    organization: proof.organization ?? undefined,
    sourceContext: proof.sourceContext,
    context: proof.context,
    approvalNote: proof.approvalNote,
    sourceApproved: Boolean(proof.sourceApproved),
    publicationApproved: Boolean(proof.publicationApproved),
    updatedAt: proof.updatedAt,
  };
}

// Public consumers only receive proof cleared through both approval gates.
router.get("/partner-proofs", async (_req: Request, res: Response): Promise<void> => {
  try {
    const proofs = await db
      .select()
      .from(partnerProofsTable)
      .where(
        and(
          eq(partnerProofsTable.sourceApproved, 1),
          eq(partnerProofsTable.publicationApproved, 1),
        ),
      );
    res.json({ proofs: proofs.map(serializeProof) });
  } catch (err) {
    console.error("GET /api/partner-proofs error:", err);
    res.status(500).json({ error: "Failed to load partner proof" });
  }
});

// Staff consumers receive all records so pending approvals can be reviewed.
router.get(
  "/partner-proofs/admin",
  requireAdminToken,
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const proofs = await db.select().from(partnerProofsTable);
      res.json({ proofs: proofs.map(serializeProof) });
    } catch (err) {
      console.error("GET /api/partner-proofs/admin error:", err);
      res.status(500).json({ error: "Failed to load partner proof" });
    }
  },
);

router.put(
  "/partner-proofs/:id",
  requireAdminToken,
  async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const body = req.body as Record<string, unknown>;

    if (!id) {
      res.status(400).json({ error: "Missing proof id" });
      return;
    }
    if (typeof body.sourceApproved !== "boolean") {
      res.status(400).json({ error: "sourceApproved must be a boolean" });
      return;
    }
    if (typeof body.publicationApproved !== "boolean") {
      res.status(400).json({ error: "publicationApproved must be a boolean" });
      return;
    }

    try {
      const updated = await db
        .update(partnerProofsTable)
        .set({
          sourceApproved: body.sourceApproved ? 1 : 0,
          publicationApproved: body.publicationApproved ? 1 : 0,
          updatedAt: new Date(),
        })
        .where(eq(partnerProofsTable.id, id))
        .returning();

      if (updated.length === 0) {
        res.status(404).json({ error: "Partner proof not found" });
        return;
      }
      res.json({ proof: serializeProof(updated[0]) });
    } catch (err) {
      console.error("PUT /api/partner-proofs error:", err);
      res.status(500).json({ error: "Failed to update partner proof" });
    }
  },
);

export default router;