import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, programOutcomesTable, aggregateImpactTable } from "@workspace/db";
import type { DbMetric, DbCohortContext, DbOutcomeDefinition, DbAggregateStat } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// ---------------------------------------------------------------------------
// Admin auth middleware
// ---------------------------------------------------------------------------

function requireAdminToken(req: Request, res: Response, next: NextFunction): void {
  const secret = process.env.SESSION_SECRET;
  const token = req.headers["x-admin-token"];
  if (!secret || !token || token !== secret) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

// ---------------------------------------------------------------------------
// Type guards / coercers for JSON body fields
// ---------------------------------------------------------------------------

function isStringOrUndefined(v: unknown): v is string | undefined {
  return v === undefined || typeof v === "string";
}

function isMetricArray(v: unknown): v is DbMetric[] {
  if (!Array.isArray(v)) return false;
  return v.every(
    (m) =>
      m !== null &&
      typeof m === "object" &&
      typeof (m as Record<string, unknown>).value === "string" &&
      typeof (m as Record<string, unknown>).label === "string",
  );
}

function isCohortContextArray(v: unknown): v is DbCohortContext[] {
  if (!Array.isArray(v)) return false;
  return v.every(
    (c) =>
      c !== null &&
      typeof c === "object" &&
      typeof (c as Record<string, unknown>).label === "string" &&
      typeof (c as Record<string, unknown>).value === "string",
  );
}

function isDefinitionArray(v: unknown): v is DbOutcomeDefinition[] {
  if (!Array.isArray(v)) return false;
  return v.every(
    (d) =>
      d !== null &&
      typeof d === "object" &&
      typeof (d as Record<string, unknown>).term === "string" &&
      typeof (d as Record<string, unknown>).definition === "string",
  );
}

function isAggregateStatArray(v: unknown): v is DbAggregateStat[] {
  if (!Array.isArray(v)) return false;
  return v.every(
    (s) =>
      s !== null &&
      typeof s === "object" &&
      typeof (s as Record<string, unknown>).value === "string" &&
      typeof (s as Record<string, unknown>).label === "string" &&
      typeof (s as Record<string, unknown>).context === "string",
  );
}

// ---------------------------------------------------------------------------
// GET /api/outcomes — public
// ---------------------------------------------------------------------------

router.get("/outcomes", async (_req: Request, res: Response): Promise<void> => {
  try {
    const [programs, impact] = await Promise.all([
      db.select().from(programOutcomesTable).orderBy(programOutcomesTable.sortOrder),
      db.select().from(aggregateImpactTable).where(eq(aggregateImpactTable.id, 1)),
    ]);

    res.json({
      programs: programs.map((p) => ({
        programId: p.programId,
        programTitle: p.programTitle,
        tagline: p.tagline,
        measurementPeriod: p.measurementPeriod,
        cohortContext: p.cohortContext,
        metrics: p.metrics,
        definitions: p.definitions,
        updatedAt: p.updatedAt,
      })),
      aggregateImpact: impact[0]
        ? {
            headline: impact[0].headline,
            note: impact[0].note,
            stats: impact[0].stats,
            updatedAt: impact[0].updatedAt,
          }
        : null,
    });
  } catch (err) {
    console.error("GET /api/outcomes error:", err);
    res.status(500).json({ error: "Failed to load outcomes" });
  }
});

// ---------------------------------------------------------------------------
// PUT /api/outcomes/programs/:programId — admin
// ---------------------------------------------------------------------------

router.put(
  "/outcomes/programs/:programId",
  requireAdminToken,
  async (req: Request, res: Response): Promise<void> => {
    // Express 5 types params as string | string[]; programId is always a scalar
    const programId = Array.isArray(req.params.programId)
      ? req.params.programId[0]
      : req.params.programId;

    if (!programId) {
      res.status(400).json({ error: "Missing programId" });
      return;
    }

    const body = req.body as Record<string, unknown>;
    const { programTitle, tagline, measurementPeriod, cohortContext, metrics, definitions } = body;

    // Validate each provided field
    if (!isStringOrUndefined(programTitle)) {
      res.status(400).json({ error: "programTitle must be a string" });
      return;
    }
    if (!isStringOrUndefined(tagline)) {
      res.status(400).json({ error: "tagline must be a string" });
      return;
    }
    if (!isStringOrUndefined(measurementPeriod)) {
      res.status(400).json({ error: "measurementPeriod must be a string" });
      return;
    }
    if (cohortContext !== undefined && !isCohortContextArray(cohortContext)) {
      res.status(400).json({ error: "cohortContext must be an array of {label, value} objects" });
      return;
    }
    if (metrics !== undefined && !isMetricArray(metrics)) {
      res.status(400).json({ error: "metrics must be an array of {value, label} objects" });
      return;
    }
    if (definitions !== undefined && !isDefinitionArray(definitions)) {
      res.status(400).json({ error: "definitions must be an array of {term, definition} objects" });
      return;
    }

    try {
      const existing = await db
        .select({ programId: programOutcomesTable.programId })
        .from(programOutcomesTable)
        .where(eq(programOutcomesTable.programId, programId));

      if (existing.length === 0) {
        res.status(404).json({ error: "Program not found" });
        return;
      }

      // Build a strongly-typed partial update object
      const updates: {
        programTitle?: string;
        tagline?: string;
        measurementPeriod?: string;
        cohortContext?: DbCohortContext[];
        metrics?: DbMetric[];
        definitions?: DbOutcomeDefinition[];
        updatedAt: Date;
      } = { updatedAt: new Date() };

      if (programTitle !== undefined) updates.programTitle = programTitle;
      if (tagline !== undefined) updates.tagline = tagline;
      if (measurementPeriod !== undefined) updates.measurementPeriod = measurementPeriod;
      if (cohortContext !== undefined) updates.cohortContext = cohortContext;
      if (metrics !== undefined) updates.metrics = metrics;
      if (definitions !== undefined) updates.definitions = definitions;

      await db
        .update(programOutcomesTable)
        .set(updates)
        .where(eq(programOutcomesTable.programId, programId));

      res.json({ ok: true });
    } catch (err) {
      console.error("PUT /api/outcomes/programs error:", err);
      res.status(500).json({ error: "Failed to update program" });
    }
  },
);

// ---------------------------------------------------------------------------
// PUT /api/outcomes/aggregate — admin; upserts the singleton row
// ---------------------------------------------------------------------------

router.put(
  "/outcomes/aggregate",
  requireAdminToken,
  async (req: Request, res: Response): Promise<void> => {
    const body = req.body as Record<string, unknown>;
    const { headline, note, stats } = body;

    if (!isStringOrUndefined(headline)) {
      res.status(400).json({ error: "headline must be a string" });
      return;
    }
    if (!isStringOrUndefined(note)) {
      res.status(400).json({ error: "note must be a string" });
      return;
    }
    if (stats !== undefined && !isAggregateStatArray(stats)) {
      res.status(400).json({ error: "stats must be an array of {value, label, context} objects" });
      return;
    }

    try {
      const existing = await db
        .select({ id: aggregateImpactTable.id })
        .from(aggregateImpactTable)
        .where(eq(aggregateImpactTable.id, 1));

      if (existing.length === 0) {
        // Initialize the singleton with provided values (or empty defaults)
        await db.insert(aggregateImpactTable).values({
          id: 1,
          headline: headline ?? "",
          note: note ?? "",
          stats: stats ?? [],
          updatedAt: new Date(),
        });
      } else {
        // Build a strongly-typed partial update object
        const updates: {
          headline?: string;
          note?: string;
          stats?: DbAggregateStat[];
          updatedAt: Date;
        } = { updatedAt: new Date() };

        if (headline !== undefined) updates.headline = headline;
        if (note !== undefined) updates.note = note;
        if (stats !== undefined) updates.stats = stats;

        await db
          .update(aggregateImpactTable)
          .set(updates)
          .where(eq(aggregateImpactTable.id, 1));
      }

      res.json({ ok: true });
    } catch (err) {
      console.error("PUT /api/outcomes/aggregate error:", err);
      res.status(500).json({ error: "Failed to update aggregate impact" });
    }
  },
);

export default router;
