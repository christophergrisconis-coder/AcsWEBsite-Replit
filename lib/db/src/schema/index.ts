import { pgTable, text, jsonb, timestamp, integer } from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Sub-shapes stored in JSONB columns
// ---------------------------------------------------------------------------

export interface DbMetric {
  value: string;
  label: string;
  note?: string;
  baseline?: { value: string; source: string };
}

export interface DbCohortContext {
  label: string;
  value: string;
}

export interface DbOutcomeDefinition {
  term: string;
  definition: string;
}

export interface DbAggregateStat {
  value: string;
  label: string;
  context: string;
}

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

export const programOutcomesTable = pgTable("program_outcomes", {
  programId: text("program_id").primaryKey(),
  programTitle: text("program_title").notNull(),
  tagline: text("tagline").notNull(),
  measurementPeriod: text("measurement_period").notNull(),
  cohortContext: jsonb("cohort_context").notNull().$type<DbCohortContext[]>(),
  metrics: jsonb("metrics").notNull().$type<DbMetric[]>(),
  definitions: jsonb("definitions").notNull().$type<DbOutcomeDefinition[]>(),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aggregateImpactTable = pgTable("aggregate_impact", {
  id: integer("id").primaryKey().default(1),
  headline: text("headline").notNull(),
  note: text("note").notNull(),
  stats: jsonb("stats").notNull().$type<DbAggregateStat[]>(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ProgramOutcomeRow = typeof programOutcomesTable.$inferSelect;
export type InsertProgramOutcome = typeof programOutcomesTable.$inferInsert;
export type AggregateImpactRow = typeof aggregateImpactTable.$inferSelect;
export type InsertAggregateImpact = typeof aggregateImpactTable.$inferInsert;
