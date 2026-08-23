import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, Download, Info } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { BriefingModal } from "@/components/BriefingModal";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { useOutcomes, type ApiProgramOutcome, type ApiAggregateImpact } from "@/hooks/use-outcomes";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Small pill showing program vs. baseline comparison */
function BaselineChip({ value, source }: { value: string; source: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <span className="text-xs uppercase tracking-widest text-muted-foreground border border-separator px-2 py-0.5">
        Baseline: {value}
      </span>
      <button
        type="button"
        className="ml-1.5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="About this baseline"
        onClick={() => setOpen((o) => !o)}
      >
        <Info size={12} />
      </button>
      {open && (
        <span className="absolute left-0 top-full mt-2 z-30 w-56 bg-background border border-separator p-3 text-xs text-muted-foreground shadow-lg">
          {source}
        </span>
      )}
    </span>
  );
}

/** Single program outcomes panel */
function ProgramPanel({
  program,
  onRequestBriefing,
}: {
  program: ApiProgramOutcome;
  onRequestBriefing: (programId: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const url = `${window.location.origin}${import.meta.env.BASE_URL}outcomes/print?program=${encodeURIComponent(program.programId)}&noprint=1`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="border-t border-separator pt-16 pb-20">
      {/* Program header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20 mb-16">
        <div className="md:col-span-1">
          <p className="text-label mb-3">Program</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {program.programTitle}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            {program.tagline}
          </p>
          {/* Per-program actions */}
          <div className="flex flex-col gap-2 items-start">
            <button
              onClick={() => onRequestBriefing(program.programId)}
              className="text-xs uppercase tracking-widest border border-foreground/30 px-4 py-2 hover:border-foreground hover:text-foreground text-muted-foreground transition-colors"
            >
              Request a briefing →
            </button>
            <div className="flex items-center gap-3">
              <a
                href={`${import.meta.env.BASE_URL}outcomes/print?program=${program.programId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Download size={12} />
                Download this program
              </a>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Copy shareable link to this program one-pager"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Cohort context */}
        <div className="md:col-span-2">
          <p className="text-label mb-4">Cohort context</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5">
            {program.cohortContext.map((ctx) => (
              <div key={ctx.label}>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  {ctx.label}
                </p>
                <p className="text-sm leading-relaxed">{ctx.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground border-l-2 border-separator pl-3">
            {program.measurementPeriod}
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-16">
        <p className="text-label mb-6">Program results</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-separator">
          {program.metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-background p-8 flex flex-col gap-3"
            >
              <p className="font-display text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                {metric.value}
              </p>
              <p className="text-sm leading-snug text-foreground">
                {metric.label}
              </p>
              {metric.note && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {metric.note}
                </p>
              )}
              {metric.baseline && (
                <BaselineChip
                  value={metric.baseline.value}
                  source={metric.baseline.source}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Definitions */}
      <div>
        <p className="text-label mb-6">Outcome definitions</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
          {program.definitions.map((def) => (
            <div key={def.term} className="border-l border-separator pl-5">
              <p className="text-sm font-semibold uppercase tracking-widest mb-2">
                {def.term}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {def.definition}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Aggregate impact strip */
function AggregateStrip({ impact }: { impact: ApiAggregateImpact }) {
  return (
    <section className="border-t border-b border-separator bg-accent/30">
      <div className="container-wide py-12">
        <p className="text-label mb-8">{impact.headline}</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-separator">
          {impact.stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-background px-8 py-10 flex flex-col gap-2"
            >
              <p className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-foreground leading-snug">
                {stat.label}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                {stat.context}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground max-w-2xl leading-relaxed">
          {impact.note}
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const Outcomes = () => {
  const { data, isError } = useOutcomes();

  const programs = data?.programs ?? [];
  const impact = data?.aggregateImpact;

  usePageMetadata(
    "Program Outcomes",
    "Source-approved program metrics, cohort context, and outcome definitions across Advanced Creation Studio's reentry, workforce, and AI programs.",
    {
      path: "/outcomes",
      structuredData: {
        "@type": "Dataset",
        name: "Advanced Creation Studio program outcomes",
        description:
          "Source-approved program metrics, cohort context, and outcome definitions across Advanced Creation Studio programs.",
        creator: {
          "@type": "Organization",
          name: "Advanced Creation Studio",
        },
        isAccessibleForFree: true,
      },
    },
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string>("general");

  const openBriefing = (programId = "general") => {
    setSelectedProgram(programId);
    setModalOpen(true);
  };

  return (
    <Layout showEchelonFooter>
      {/* Page heading */}
      <section className="container-wide pt-16 md:pt-24 pb-16 md:pb-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-label mb-4">Outcomes report</p>
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none">
              Program results
            </h1>
          </div>
          <div className="flex flex-col gap-4 items-start md:items-end">
            <p className="max-w-sm text-muted-foreground text-sm md:text-base leading-relaxed">
              Source-approved metrics across active programs. Baselines reflect
              published state, federal, or agency averages for comparable
              populations.
            </p>
            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href={`${import.meta.env.BASE_URL}outcomes/print`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-foreground/40 text-foreground px-5 py-3 text-sm uppercase tracking-widest hover:border-foreground transition-colors"
              >
                <Download size={14} />
                Download summary
              </a>
              <button
                onClick={() => openBriefing("general")}
                className="inline-flex items-center gap-3 bg-foreground text-background px-6 py-3 text-sm uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity"
              >
                Request a briefing
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Offline notice — only shown if the live fetch failed */}
        {isError && (
          <p className="mt-6 text-xs text-muted-foreground border border-separator px-4 py-2 inline-block">
            Showing last-known figures — live data temporarily unavailable.
          </p>
        )}
      </section>

      {/* Aggregate impact strip */}
      {impact && <AggregateStrip impact={impact} />}

      {/* Per-program panels — each has its own briefing CTA */}
      <section className="container-wide py-16 md:py-24">
        {programs.map((program) => (
          <ProgramPanel
            key={program.programId}
            program={program}
            onRequestBriefing={openBriefing}
          />
        ))}
      </section>

      {/* Data provenance note */}
      <section className="container-wide pb-12">
        <div className="border border-separator p-8 max-w-2xl">
          <p className="text-label mb-3">About this data</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Figures on this page reflect program-level results as documented in
            Advanced Creation Studio program records. State and federal baselines
            are drawn from publicly available agency reports and are cited
            per-metric. Definitions follow the measurement criteria used in
            program tracking; any deviation from agency-standard definitions is
            noted inline. This page is updated as new cohort data is reviewed
            and approved.
          </p>
        </div>
      </section>

      {/* Navigation */}
      <section className="container-wide pb-24 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <Link
          href="/work"
          className="inline-flex items-center gap-3 text-muted-foreground hover-highlight group"
        >
          <ArrowLeft
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />
          <span>Back to impact areas</span>
        </Link>
        <button
          onClick={() => openBriefing("general")}
          className="inline-flex items-center gap-3 text-foreground hover-highlight group"
        >
          <span>Request a program briefing</span>
          <ArrowRight
            size={20}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </section>

      {/* Briefing inquiry modal */}
      <BriefingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultProgram={selectedProgram}
      />
    </Layout>
  );
};

export default Outcomes;
