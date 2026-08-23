/**
 * Program outcome data — sourced from Advanced Creation Studio program records.
 * Baselines reflect published state and agency averages cited in program documentation.
 */

export interface Metric {
  value: string;
  label: string;
  note?: string;
  /** Present when the metric can be compared against a known baseline */
  baseline?: {
    value: string;
    source: string;
  };
}

export interface OutcomeDefinition {
  term: string;
  definition: string;
}

export interface CohortContext {
  label: string;
  value: string;
}

export interface ProgramOutcome {
  programId: string;
  programTitle: string;
  tagline: string;
  /** Measurement window or reporting period */
  measurementPeriod: string;
  cohortContext: CohortContext[];
  metrics: Metric[];
  definitions: OutcomeDefinition[];
}

export const programOutcomes: ProgramOutcome[] = [
  {
    programId: "reentry-pathways",
    programTitle: "Reentry Pathways",
    tagline: "Sustained reintegration, measured from release through 36 months",
    measurementPeriod: "Outcome window: 90-day, 12-month, and 36-month post-release",
    cohortContext: [
      { label: "Cohort size", value: "Returning citizens enrolled in structured pre-release vocational track" },
      { label: "Eligibility", value: "Adults within 6–18 months of release; no exclusion by offense type" },
      { label: "Program structure", value: "Four-phase: pre-release training → 72-hour stabilization → direct placement → 12-month follow-on support" },
      { label: "Delivery sites", value: "Correctional facilities and community re-entry centers" },
    ],
    metrics: [
      {
        value: "68%",
        label: "Secured employment within 90 days of release",
        baseline: {
          value: "27%",
          source: "State DOC re-entry employment average",
        },
      },
      {
        value: "18%",
        label: "3-year recidivism rate",
        note: "Defined as rearrest resulting in new conviction",
        baseline: {
          value: "43%",
          source: "State 3-year recidivism average (DOC annual report)",
        },
      },
      {
        value: "94%",
        label: "Program completion rate",
        note: "Participants who completed all four phases",
      },
      {
        value: "82%",
        label: "Stable housing at 12 months post-release",
        baseline: {
          value: "51%",
          source: "National reentry housing stability benchmark (NIC)",
        },
      },
      {
        value: "73%",
        label: "Employment retention at 12 months",
        note: "Of those placed, still employed with same or new employer",
        baseline: {
          value: "48%",
          source: "Bureau of Labor Statistics reentry cohort retention estimate",
        },
      },
    ],
    definitions: [
      {
        term: "Recidivism",
        definition:
          "Rearrest that results in a new criminal conviction within 36 months of release. Does not include technical violations or arrests without conviction.",
      },
      {
        term: "Employment (90-day)",
        definition:
          "Participant secured a paid role — W-2, 1099, or verified self-employment — within 90 calendar days of release date.",
      },
      {
        term: "Stable housing",
        definition:
          "Verified permanent or transitional housing at the 12-month follow-up point. Does not include shelter stays.",
      },
      {
        term: "Program completion",
        definition:
          "Participant finished all four structured phases: pre-release training, 72-hour stabilization, employer placement, and first-year support check-ins.",
      },
    ],
  },
  {
    programId: "ai-upskilling",
    programTitle: "AI Upskilling",
    tagline: "Practical AI competency delivered to agency teams and workforce cohorts",
    measurementPeriod: "Outcome window: 30-day and 60-day post-cohort",
    cohortContext: [
      { label: "Cohort composition", value: "Agency staff, workforce development participants, and adult learners with no prior AI background required" },
      { label: "Format", value: "Intensive bootcamps (3–5 days) and modular course tracks (4–8 weeks)" },
      { label: "Curriculum areas", value: "Prompt engineering, AI-assisted office automation, AI governance, workforce-ready AI applications" },
      { label: "Delivery", value: "In-person and hybrid cohorts; government and community sites" },
    ],
    metrics: [
      {
        value: "91%",
        label: "Certification completion rate",
        note: "Participants who passed the competency assessment",
      },
      {
        value: "78%",
        label: "Applied AI tools in their role within 60 days",
        note: "Self-reported and supervisor-verified application of course skills",
      },
      {
        value: "4.7 / 5",
        label: "Average participant satisfaction score",
      },
      {
        value: "86%",
        label: "Reported confidence increase in AI-adjacent tasks",
        note: "Pre/post survey, same cohort",
        baseline: {
          value: "Low or no confidence reported before training",
          source: "ACS pre-cohort intake survey",
        },
      },
    ],
    definitions: [
      {
        term: "Certification completion",
        definition:
          "Participant passed the end-of-course competency assessment at the required threshold (70% or above) and received a course certificate.",
      },
      {
        term: "Applied within 60 days",
        definition:
          "Participant self-reported using at least one AI tool or technique from the curriculum in their professional context within 60 days of cohort end, verified by supervisor confirmation where available.",
      },
      {
        term: "Confidence increase",
        definition:
          "Movement of at least two points on a 5-point Likert confidence scale, measured with the same instrument before and after the training cohort.",
      },
    ],
  },
  {
    programId: "direct-placement",
    programTitle: "Direct Placement",
    tagline: "Employer-connected job placement with measured retention",
    measurementPeriod: "Outcome window: 120-day placement and 12-month retention",
    cohortContext: [
      { label: "Eligible participants", value: "Completers of ACS workforce or reentry training tracks" },
      { label: "Employer network", value: "Vetted employers across logistics, construction, technology, and service sectors" },
      { label: "Support structure", value: "Job readiness coaching, resume review, and 6-month post-placement check-ins" },
    ],
    metrics: [
      {
        value: "83%",
        label: "Job placement rate within 120 days of training completion",
        baseline: {
          value: "54%",
          source: "USDOL workforce program national placement average",
        },
      },
      {
        value: "72%",
        label: "Employment retention at 12 months",
        baseline: {
          value: "58%",
          source: "USDOL 12-month retention benchmark for similar programs",
        },
      },
      {
        value: "$18.40",
        label: "Median hourly starting wage",
        note: "Across all placed participants",
        baseline: {
          value: "$14.20",
          source: "State workforce board median for comparable placements",
        },
      },
    ],
    definitions: [
      {
        term: "Placement rate",
        definition:
          "Percentage of eligible completers who began paid employment within 120 days of their training completion date.",
      },
      {
        term: "Retention at 12 months",
        definition:
          "Percentage of placed participants who remained continuously employed — with same or new employer — through the 12-month mark post-placement.",
      },
      {
        term: "Median starting wage",
        definition:
          "The hourly wage at the midpoint of placed participants' compensation range at time of placement, not adjusted for subsequent raises.",
      },
    ],
  },
];

/** Aggregate impact figures for the top-level outcomes summary */
export const aggregateImpact = {
  headline: "Outcomes across all active programs",
  note:
    "Figures represent program-level results across all active ACS cohorts. Baselines reflect published state or federal averages for comparable populations.",
  stats: [
    { value: "68%", label: "Employment within 90 days", context: "vs. 27% state average" },
    { value: "18%", label: "3-year recidivism rate", context: "vs. 43% state average" },
    { value: "83%", label: "Job placement rate", context: "vs. 54% national benchmark" },
    { value: "91%", label: "AI certification completion", context: "across workforce cohorts" },
  ],
};
