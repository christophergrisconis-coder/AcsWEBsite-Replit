import { useEffect } from "react";
import {
  useOutcomes,
  type ApiProgramOutcome,
  type ApiAggregateImpact,
  type ApiMetric,
} from "@/hooks/use-outcomes";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { projects } from "@/data/projects";
import { programOutcomes } from "@/data/outcomes";
import "@/styles/outcomes-print.css";

/**
 * Print-optimised one-pager for Advanced Creation Studio program outcomes.
 *
 * Opens in a new tab; `window.print()` fires automatically after the live
 * outcomes API fetch has settled, so the document always contains current
 * figures. Falls back to static data on network error (same policy as the
 * main Outcomes page via `useOutcomes`).
 *
 * When `?program=<programId>` is present in the URL, only that program is
 * rendered as a focused one-pager (About intro + cohort context + metrics +
 * definitions) with the aggregate stats header omitted.
 * Without the param, the full all-programs summary is rendered unchanged.
 */
const OutcomesPrint = () => {
  const { data, isFetching } = useOutcomes();

  // Detect query params to decide which layout to render.
  // Computed before effects so the print suppression logic can reference them.
  const params = new URLSearchParams(window.location.search);
  const programParam = params.get("program");
  const noPrint = params.get("noprint") === "1";

  const programs = data?.programs ?? [];
  const aggregateImpact = data?.aggregateImpact ?? null;

  const singleProgram = programParam
    ? (programs.find((p) => p.programId === programParam) ?? null)
    : null;

  // True when a ?program= value was supplied but matched nothing after the
  // fetch has settled. We must wait for isFetching to be false so we don't
  // flash an error while the data is still loading.
  const programNotFound =
    !isFetching && programParam !== null && singleProgram === null;

  const staticProgram = programParam
    ? (programOutcomes.find((p) => p.programId === programParam) ?? null)
    : null;
  const metadataProgram = singleProgram ?? staticProgram;
  const printTitle = programNotFound
    ? "Program One-Pager Unavailable"
    : metadataProgram?.programTitle
      ? `${metadataProgram.programTitle} One-Pager`
      : "Program Outcomes Summary";
  const printDescription = programNotFound
    ? "This Advanced Creation Studio program link is no longer active. View the current outcomes report for the latest program information."
    : metadataProgram?.tagline ??
      "A printable summary of Advanced Creation Studio source-approved program outcomes, cohort context, and definitions.";

  usePageMetadata(printTitle, printDescription, {
    path: programParam
      ? `/outcomes/print?program=${encodeURIComponent(programParam)}`
      : "/outcomes/print",
    image: metadataProgram
      ? projects.find((project) => project.id === metadataProgram.programId)?.coverImage
      : undefined,
    robots: programNotFound ? "noindex,follow" : "index,follow",
    structuredData: {
      "@type": "Report",
      name: printTitle,
      description: printDescription,
      about: {
        "@type": "Organization",
        name: "Advanced Creation Studio",
      },
    },
  });

  // Only trigger print after the live fetch has settled (success or fallback).
  // Suppress auto-print when the program wasn't found or ?noprint=1 is set
  // (partners use the noprint flag to inspect the document before printing).
  useEffect(() => {
    if (isFetching) return;
    if (programNotFound) return;
    if (noPrint) return;
    const id = setTimeout(() => window.print(), 300);
    return () => clearTimeout(id);
  }, [isFetching, programNotFound, noPrint]);

  const generatedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="acs-print-root font-sans bg-background text-foreground">
      {/* ── Screen-only hint (hidden when printing) ────────────────── */}
      <div className="print:hidden mb-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground border border-border bg-muted py-2 px-4">
        {isFetching ? (
          <span>Loading latest program data…</span>
        ) : (
          <>
            <span>
              Tip: use your browser&apos;s <strong>File → Print</strong> or{" "}
              <strong>Save as PDF</strong> to export this document.
            </span>
            {!programNotFound && (
              <a
                href={(() => { const u = new URL(window.location.href); u.searchParams.set("noprint", "1"); return u.toString(); })()}
                className="shrink-0 underline hover:text-foreground transition-colors"
              >
                Open without auto-print
              </a>
            )}
          </>
        )}
      </div>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="flex items-start justify-between pb-3 border-b-2 border-foreground mb-5">
        <div>
          <p className="font-serif font-extrabold text-2xl tracking-tight leading-none">
            Advanced Creation Studio
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            advancedcreationstudio.com
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-widest">
            {programParam ? "Program One-Pager" : "Program Outcomes Summary"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Generated {generatedDate}
          </p>
        </div>
      </header>

      {programNotFound ? (
        <ProgramNotFoundBody />
      ) : singleProgram ? (
        <SingleProgramBody program={singleProgram} />
      ) : (
        <AllProgramsBody programs={programs} aggregateImpact={aggregateImpact} />
      )}

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-border mt-5 pt-2.5">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              Advanced Creation Studio
            </span>{" "}
            · advancedcreationstudio.com · CAGE: 9K8B2 · UEI: ACS-8902-FED
          </p>
          <p className="text-xs text-muted-foreground">
            Figures reflect program-level results from ACS program records.
            Baselines drawn from publicly available state, federal, and agency
            reports cited per metric. Cohort context, definitions, and full
            source citations available at{" "}
            <span className="font-medium text-foreground">
              advancedcreationstudio.com/outcomes
            </span>
            .
          </p>
        </div>
      </footer>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Program-not-found error body
// ---------------------------------------------------------------------------

function ProgramNotFoundBody() {
  return (
    <section className="py-8 text-center">
      <p className="font-serif font-bold text-lg mb-2">Program not found</p>
      <p className="text-xs text-muted-foreground leading-snug">
        The link you followed doesn&apos;t match any current program — it may
        have been renamed or removed.
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        View the full outcomes report at{" "}
        <span className="font-medium text-foreground">
          advancedcreationstudio.com/outcomes
        </span>
        .
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Single-program one-pager body
// ---------------------------------------------------------------------------

function SingleProgramBody({ program }: { program: ApiProgramOutcome }) {
  return (
    <>
      {/* ── About this program ────────────────────────────────────── */}
      <section className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          About this program
        </p>
        <p className="font-serif font-bold text-xl leading-tight mb-1">
          {program.programTitle}
        </p>
        <p className="text-xs text-muted-foreground leading-snug">
          {program.tagline}
        </p>
        <p className="text-xs text-muted-foreground mt-1 italic">
          {program.measurementPeriod}
        </p>
      </section>

      {/* ── Cohort context ────────────────────────────────────────── */}
      {program.cohortContext.length > 0 && (
        <section className="mb-5 border-t border-foreground pt-3">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2">
            Cohort context
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {program.cohortContext.map((ctx) => (
              <div key={ctx.label}>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-0.5">
                  {ctx.label}
                </p>
                <p className="text-xs leading-snug">{ctx.value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Metrics ───────────────────────────────────────────────── */}
      <section className="mb-5 border-t border-foreground pt-3">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2">
          Program results
        </p>
        <MetricGrid metrics={program.metrics} />
      </section>

      {/* ── Definitions ───────────────────────────────────────────── */}
      {program.definitions.length > 0 && (
        <section className="border-t border-foreground pt-3">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2">
            Outcome definitions
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {program.definitions.map((def) => (
              <div key={def.term}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-0.5">
                  {def.term}
                </p>
                <p className="text-xs text-muted-foreground leading-snug">
                  {def.definition}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// All-programs summary body (original layout — unchanged)
// ---------------------------------------------------------------------------

function AllProgramsBody({
  programs,
  aggregateImpact,
}: {
  programs: ApiProgramOutcome[];
  aggregateImpact: ApiAggregateImpact | null;
}) {
  return (
    <>
      {/* ── Aggregate impact stats ──────────────────────────────────── */}
      {aggregateImpact && (
        <section className="mb-5">
          <p className="text-label mb-2">{aggregateImpact.headline}</p>
          <div className="grid grid-cols-4 border border-foreground">
            {aggregateImpact.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`px-3 py-2.5${i < 3 ? " border-r border-foreground" : ""}`}
              >
                <p className="font-serif font-extrabold text-3xl leading-none mb-1">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold leading-snug">{stat.label}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">
                  {stat.context}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Per-program sections ─────────────────────────────────────── */}
      {programs.map((program) => (
        <section
          key={program.programId}
          className="acs-print-program border-t-2 border-foreground pt-3 mt-3"
        >
          {/* Program title + period */}
          <div className="flex items-baseline justify-between gap-4 mb-1">
            <h2 className="font-serif font-bold text-base leading-tight">
              {program.programTitle}
            </h2>
            <p className="text-xs text-muted-foreground shrink-0">
              {program.measurementPeriod}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mb-3">{program.tagline}</p>

          {/* Headline metrics — compact 3-up grid */}
          <MetricGrid metrics={program.metrics} />
        </section>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Shared metric grid
// ---------------------------------------------------------------------------

/** Compact 3-column metric grid — headline value, label, optional baseline */
function MetricGrid({ metrics }: { metrics: ApiMetric[] }) {
  return (
    <div className="grid grid-cols-3 border border-border">
      {metrics.map((metric, i) => {
        const col = i % 3;
        const isLastRow = i >= metrics.length - (metrics.length % 3 || 3);
        return (
          <div
            key={metric.label}
            className={[
              "acs-print-metric px-3 py-2",
              col < 2 ? "border-r border-border" : "",
              !isLastRow ? "border-b border-border" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <p className="font-serif font-bold text-xl leading-none mb-1">
              {metric.value}
            </p>
            <p className="text-xs font-medium leading-snug">{metric.label}</p>
            {metric.baseline && (
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                Baseline: {metric.baseline.value}
              </p>
            )}
          </div>
        );
      })}
      {/* Pad incomplete last row with empty cells to keep borders even */}
      {metrics.length % 3 !== 0 &&
        Array.from({ length: 3 - (metrics.length % 3) }).map((_, i) => (
          <div
            key={`pad-${i}`}
            className={i === 0 ? "border-r border-border" : ""}
          />
        ))}
    </div>
  );
}

export default OutcomesPrint;
