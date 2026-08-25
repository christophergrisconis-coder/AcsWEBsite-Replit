import { useState } from "react";
import { ArrowRight, Check, Download } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { BriefingModal } from "@/components/BriefingModal";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { verifiedPartnerProofs } from "@/data/projects";
import { filterPublishablePartnerProofs } from "@/data/partner-proof";

const audiences = [
  "State and federal agencies",
  "Corrections and rehabilitation",
  "Workforce development boards",
  "Violence prevention initiatives",
  "Public-sector technology programs",
  "Employer and community partners",
];

const engagementPaths = [
  {
    number: "01",
    label: "Program delivery",
    title: "Build a pathway people can use.",
    description:
      "Reentry education, life-readiness coaching, mentorship, stabilization, and workforce preparation connected into a route from release to durable opportunity.",
    link: "/work/reentry-pathways",
    linkLabel: "Explore reentry pathways",
    briefingInterest: "reentry-pathways",
  },
  {
    number: "02",
    label: "Workforce readiness",
    title: "Put participants in the builder's seat.",
    description:
      "Coding, AI literacy, digital entrepreneurship, and practical technology training aligned to high-growth work and the confidence to pursue it.",
    link: "/work/ai-upskilling",
    linkLabel: "Explore AI upskilling",
    briefingInterest: "ai-upskilling",
  },
  {
    number: "03",
    label: "Communications",
    title: "Make the mission understood.",
    description:
      "Positioning, narrative architecture, and turnkey media production that help public programs communicate clearly with participants, partners, and the public.",
    link: "/work/strategic-media",
    linkLabel: "Explore strategic media",
    briefingInterest: "general",
  },
  {
    number: "04",
    label: "Evidence and tools",
    title: "Make progress visible.",
    description:
      "Digital products, structured content, and outcomes reporting that turn program activity into usable information for decisions, accountability, and next steps.",
    link: "/outcomes",
    linkLabel: "Review outcomes",
    briefingInterest: "direct-placement",
  },
];

const partnerSteps = [
  "Bring the mission, constraint, or opportunity",
  "Clarify the population, partners, and desired movement",
  "Shape a practical delivery or communications path",
  "Review the evidence and next decision together",
];

const publishablePartnerProofs = filterPublishablePartnerProofs(verifiedPartnerProofs);

const PartnerResources = () => {
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [briefingProgram, setBriefingProgram] = useState("general");

  const openBriefing = (programInterest = "general") => {
    setBriefingProgram(programInterest);
    setBriefingOpen(true);
  };

  usePageMetadata(
    "Partner Resources",
    "See how Advanced Creation Studio helps agencies, workforce boards, community organizations, and employers build practical pathways from reentry to opportunity.",
    {
      path: "/partners",
      structuredData: {
        "@type": "WebPage",
        name: "Advanced Creation Studio partner resources",
        about: {
          "@type": "Organization",
          name: "Advanced Creation Studio",
        },
      },
    },
  );

  return (
    <Layout showEchelonFooter>
      <section className="container-wide pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="max-w-5xl">
          <p className="text-label mb-5">For agency and community partners</p>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9]">
            A clear route
            <br />
            from mission
            <br />
            to movement.
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mt-14 md:mt-20">
            <p className="md:col-span-2 text-xl md:text-2xl leading-relaxed text-muted-foreground">
              Advanced Creation Studio helps public-sector and community
              partners turn complex challenges into practical, measurable
              pathways for people and programs.
            </p>
            <div className="flex flex-col items-start gap-5">
              <button
                type="button"
                onClick={() => openBriefing("general")}
                className="inline-flex items-center gap-3 bg-foreground text-background px-6 py-3 text-sm uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity focus-visible-ring"
              >
                Start a briefing
                <ArrowRight size={16} />
              </button>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tell us what your agency is evaluating and we will shape the
                right next conversation.
              </p>
              <a
                href="/api/partner-resources/capabilities.pdf"
                download="ACS-Partner-Capabilities.pdf"
                className="inline-flex items-center gap-3 text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group focus-visible-ring"
              >
                <Download size={16} />
                <span>Download capabilities statement</span>
              </a>
              <a
                href="/partners/print?noprint=1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors focus-visible-ring"
              >
                <span>View print layout</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-separator bg-accent/30">
        <div className="container-wide py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-20">
            <div>
              <p className="text-label mb-4">Who this is for</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                Built around the people already doing the work.
              </h2>
            </div>
            <ul className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              {audiences.map((audience) => (
                <li key={audience} className="flex items-start gap-3 text-lg">
                  <Check size={18} className="mt-1 text-accent shrink-0" />
                  <span>{audience}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-wide py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-label mb-4">Ways to engage</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
              Start where the need is.
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground leading-relaxed">
            ACS can support one part of a larger effort or help connect the
            pieces into a more coherent path.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-separator">
          {engagementPaths.map((path) => (
            <article key={path.number} className="bg-background border border-separator p-8 md:p-10 flex flex-col min-h-[300px]">
              <div className="flex items-start justify-between gap-6 mb-10">
                <p className="text-label text-accent">{path.number}</p>
                <p className="text-label text-muted-foreground">{path.label}</p>
              </div>
              <h3 className="font-display text-3xl font-bold tracking-tight mb-4">
                {path.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-xl">
                {path.description}
              </p>
              <div className="mt-auto pt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                <Link
                  href={path.link}
                  className="inline-flex items-center gap-3 text-sm uppercase tracking-widest hover-highlight group"
                >
                  <span>{path.linkLabel}</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => openBriefing(path.briefingInterest)}
                  className="inline-flex items-center gap-3 text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors focus-visible-ring"
                >
                  Request a briefing
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-separator bg-accent/30" aria-labelledby="verified-proof-heading">
        <div className="container-wide py-20 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-20">
            <div>
              <p className="text-label mb-4">Verified partner proof</p>
              <h2
                id="verified-proof-heading"
                className="font-display text-4xl md:text-5xl font-bold tracking-tight"
              >
                Evidence should earn its place.
              </h2>
            </div>
            <div className="lg:col-span-2">
              {publishablePartnerProofs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-separator">
                  {publishablePartnerProofs.map((proof) => (
                    <article
                      key={proof.id}
                      className="bg-background border border-separator p-7 md:p-8"
                    >
                      <p className="text-label text-accent mb-6">{proof.kind}</p>
                      {proof.quote ? (
                        <blockquote className="font-display text-2xl leading-snug">
                          "{proof.quote}"
                        </blockquote>
                      ) : (
                        <h3 className="font-display text-2xl font-bold tracking-tight">
                          {proof.title}
                        </h3>
                      )}
                      <p className="text-sm text-muted-foreground leading-relaxed mt-6">
                        {proof.context}
                      </p>
                      {proof.organization ? (
                        <p className="text-label mt-5">{proof.organization}</p>
                      ) : null}
                      <p className="text-xs text-muted-foreground leading-relaxed mt-5 border-t border-separator pt-4">
                        Source: {proof.sourceContext}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-5 border-t border-separator pt-4">
                        {proof.approvalNote}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="border border-separator bg-background p-7 md:p-10">
                  <p className="text-label text-accent mb-5">Source approval in progress</p>
                  <h3 className="font-display text-3xl font-bold tracking-tight mb-4">
                    Partner stories will appear here when they are ready to share.
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                    ACS is keeping this space reserved for testimonials, partner
                    marks, and case-study excerpts that have been provided and
                    cleared for publication. No endorsement or outcome is implied
                    until the source and context are confirmed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-separator">
        <div className="container-wide py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            <div>
              <p className="text-label mb-4">The ACS approach</p>
              <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                Listen closely. Build practically. Measure honestly.
              </h2>
            </div>
            <div>
              <ol className="divide-y divide-separator border-y border-separator">
                {partnerSteps.map((step, index) => (
                  <li key={step} className="flex gap-6 py-5 text-lg">
                    <span className="text-label text-accent shrink-0">
                      0{index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-8">
                The work is designed for real constraints, clear
                communication, and outcomes that partners can stand behind.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide py-24 md:py-32">
        <div className="border border-separator p-8 md:p-14 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div className="max-w-2xl">
            <p className="text-label mb-4">Choose the next conversation</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-5">
              Bring us the mission, constraint, or opportunity.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We will help you identify the clearest path forward—whether that
              starts with a program briefing, an outcomes review, or a focused
              conversation about communications and delivery.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openBriefing("general")}
            className="inline-flex items-center gap-3 shrink-0 text-sm uppercase tracking-widest text-foreground hover-highlight group focus-visible-ring"
          >
            <span>Request a program briefing</span>
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </section>

      <BriefingModal
        open={briefingOpen}
        onClose={() => setBriefingOpen(false)}
        defaultProgram={briefingProgram}
      />
    </Layout>
  );
};

export default PartnerResources;