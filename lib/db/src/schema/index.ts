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

export interface DbPartnerProof {
  id: string;
  kind: "testimonial" | "logo" | "case-study";
  title: string;
  quote?: string;
  organization?: string;
  sourceContext: string;
  context: string;
  approvalNote: string;
  sourceApproved: boolean;
  publicationApproved: boolean;
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

export const partnerProofsTable = pgTable("partner_proofs", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  quote: text("quote"),
  organization: text("organization"),
  sourceContext: text("source_context").notNull(),
  context: text("context").notNull(),
  approvalNote: text("approval_note").notNull(),
  sourceApproved: integer("source_approved").notNull().default(0),
  publicationApproved: integer("publication_approved").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const briefingRequestsTable = pgTable("briefing_requests", {
  id: text("id").primaryKey(),
  agencyName: text("agency_name").notNull(),
  programInterest: text("program_interest").notNull(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  message: text("message"),
  notificationStatus: text("notification_status").notNull().default("pending"),
  notificationError: text("notification_error"),
  notifiedAt: timestamp("notified_at", { withTimezone: true }),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ProgramOutcomeRow = typeof programOutcomesTable.$inferSelect;
export type InsertProgramOutcome = typeof programOutcomesTable.$inferInsert;
export type AggregateImpactRow = typeof aggregateImpactTable.$inferSelect;
export type InsertAggregateImpact = typeof aggregateImpactTable.$inferInsert;
export type BriefingRequestRow = typeof briefingRequestsTable.$inferSelect;
export type InsertBriefingRequest = typeof briefingRequestsTable.$inferInsert;
