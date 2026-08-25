import { useEffect } from "react";
import { ArrowRight, Download } from "lucide-react";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import "@/styles/capabilities-print.css";

const audiences = [
  "State and federal agencies",
  "Corrections and rehabilitation",
  "Workforce development boards",
  "Violence prevention initiatives",
  "Public-sector technology programs",
  "Employer and community partners",
];

const pillars = [
  {
    number: "01",
    title: "Reentry education",
    description:
      "Life-readiness coaching and practical preparation that help returning citizens build confidence, direction, and a credible next step.",
  },
  {
    number: "02",
    title: "Reintegration support",
    description:
      "Mentorship, wraparound community support, and direct stakeholder engagement that make the first days and months after release more navigable.",
  },
  {
    number: "03",
    title: "AI and workforce readiness",
    description:
      "Coding, AI literacy, digital entrepreneurship, and employment-focused training aligned to high-growth opportunity.",
  },
];

const capabilities = [
  {
    label: "01 / Message",
    title: "Strategic messaging",
    description:
      "Positioning, narrative systems, and communications built for agency partners, RFP reuse, and clear public understanding.",
  },
  {
    label: "02 / Make",
    title: "Media production",
    description:
      "Human-centered stories and production support that make complex programs visible, credible, and easier to engage with.",
  },
  {
    label: "03 / Ready",
    title: "Contract readiness",
    description:
      "A disciplined creative standard for federal and state partners: consistent, compliance-aware, and ready for the next review.",
  },
  {
    label: "04 / Build",
    title: "Digital products and outcomes reporting",
    description:
      "Digital products, structured content, and outcomes reporting that turn program activity into usable information for decisions, accountability, and next steps.",
  },
];

const engagementPaths = [
  {
    number: "01",
    title: "Program delivery",
    description:
      "Reentry education, life-readiness coaching, mentorship, stabilization, and workforce preparation connected into a route from release to durable opportunity.",
  },
  {
    number: "02",
    title: "Workforce readiness",
    description:
      "Coding, AI literacy, digital entrepreneurship, and practical technology training aligned to high-growth work and the confidence to pursue it.",
  },
  {
    number: "03",
    title: "Communications",
    description:
      "Positioning, narrative architecture, and turnkey media production that help public programs communicate clearly with participants, partners, and the public.",
  },
  {
    number: "04",
    title: "Evidence and tools",
    description:
      "Digital products, structured content, and outcomes reporting that turn program activity into usable information for decisions, accountability, and next steps.",
  },
];

const CapabilitiesPrint = () => {
  const params = new URLSearchParams(window.location.search);
  const noPrint = params.get("noprint") === "1";

  usePageMetadata(
    "Partner Capabilities Statement",
    "A printable capabilities statement for agency and community partners evaluating Advanced Creation Studio.",
    {
      path: "/partners/print",
      structuredData: {
        "@type": "Article",
        name: "Advanced Creation Studio partner capabilities statement",
        about: {
          "@type": "Organization",
          name: "Advanced Creation Studio",
        },
      },
    },
  );

  useEffect(() => {
    if (noPrint) return;
    const id = setTimeout(() => window.print(), 300);
    return () => clearTimeout(id);
  }, [noPrint]);

  const generatedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="acs-capabilities-root font-sans bg-background text-foreground">
      <div className="print:hidden mb-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground border border-border bg-muted py-2 px-4">
        <span>
          Download a ready-to-share PDF, or use your browser&apos;s{" "}
          <strong>File → Print</strong> dialog.
        </span>
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="/api/partner-resources/capabilities.pdf"
            download="ACS-Partner-Capabilities.pdf"
            className="inline-flex items-center gap-2 underline hover:text-foreground transition-colors"
          >
            <Download size={14} />
            Download PDF
          </a>
          <a
            href={(() => {
              const url = new URL(window.location.href);
              url.searchParams.set("noprint", "1");
              return url.toString();
            })()}
            className="underline hover:text-foreground transition-colors"
          >
            Open without auto-print
          </a>
        </div>
      </div>

      <header className="flex items-start justify-between gap-6 pb-4 border-b-2 border-foreground mb-7">
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
            Partner capabilities
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Generated {generatedDate}
          </p>
        </div>
      </header>

      <section className="mb-7">
        <p className="text-label mb-3">For agency and community partners</p>
        <h1 className="font-serif font-bold text-5xl leading-[0.92] tracking-tight max-w-2xl">
          A clear route from mission to movement.
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mt-4">
          Advanced Creation Studio helps public-sector and community partners
          turn complex challenges into practical, measurable pathways for
          people and programs.
        </p>
      </section>

      <section className="acs-capabilities-section border-t-2 border-foreground pt-4 mb-7">
        <div className="flex items-baseline justify-between gap-6 mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest">
            Who this is for
          </h2>
          <p className="text-xs text-muted-foreground">
            Built around the people already doing the work.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
          {audiences.map((audience) => (
            <li key={audience} className="flex items-start gap-2 text-sm">
              <span className="text-accent" aria-hidden="true">•</span>
              <span>{audience}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="acs-capabilities-section border-t-2 border-foreground pt-4 mb-7">
        <div className="flex items-baseline justify-between gap-6 mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest">
            Three connected pillars
          </h2>
          <p className="text-xs text-muted-foreground">
            A pathway, not a handoff.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-px bg-separator border border-separator">
          {pillars.map((pillar) => (
            <article key={pillar.number} className="bg-background p-4">
              <p className="text-label text-accent mb-4">{pillar.number}</p>
              <h3 className="font-serif font-bold text-lg leading-tight mb-2">
                {pillar.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-snug">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="acs-capabilities-section border-t-2 border-foreground pt-4 mb-7">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-3">
          Built for execution
        </h2>
        <div className="grid grid-cols-2 gap-px bg-separator border border-separator">
          {capabilities.map((capability) => (
            <article key={capability.title} className="bg-background p-4">
              <p className="text-label text-accent mb-3">{capability.label}</p>
              <h3 className="font-serif font-bold text-lg leading-tight mb-2">
                {capability.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-snug">
                {capability.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="acs-capabilities-section border-t-2 border-foreground pt-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-3">
          Ways to engage
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {engagementPaths.map((path) => (
            <article key={path.number} className="flex gap-3">
              <p className="text-label text-accent shrink-0">{path.number}</p>
              <div>
                <h3 className="font-serif font-bold text-base leading-tight mb-1">
                  {path.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-snug">
                  {path.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="acs-capabilities-cta border-y-2 border-foreground mt-7 py-4 flex items-center justify-between gap-8">
        <div>
          <p className="text-label text-accent mb-1">Choose the next conversation</p>
          <h2 className="font-serif font-bold text-xl leading-tight">
            Bring us the mission, constraint, or opportunity.
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            We will help you identify the clearest path forward.
          </p>
        </div>
        <a
          href="/partners"
          className="shrink-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold"
        >
          <span>Request a briefing</span>
          <ArrowRight size={14} />
        </a>
      </section>

      <footer className="border-t border-border mt-4 pt-2.5">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            Advanced Creation Studio
          </span>{" "}
          · advancedcreationstudio.com · Partner capabilities statement
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Request a tailored program briefing at advancedcreationstudio.com/partners.
        </p>
      </footer>
    </main>
  );
};

export default CapabilitiesPrint;
