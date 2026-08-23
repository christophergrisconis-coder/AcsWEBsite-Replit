import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { ProjectListItem } from "@/components/ProjectListItem";
import { BriefingModal } from "@/components/BriefingModal";
import { projects } from "@/data/projects";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { aggregateImpact } from "@/data/outcomes";

const Work = () => {
  const [briefingOpen, setBriefingOpen] = useState(false);

  usePageMetadata(
    "Impact in Action",
    "Explore Advanced Creation Studio's reentry, AI, workforce, media, and public-sector impact areas.",
  );
  return (
    <Layout showEchelonFooter>
      {/* Heading */}
      <section className="container-wide pt-16 md:pt-24 pb-16 md:pb-20">
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight">
          Impact in action
        </h1>
      </section>

      {/* Project list */}
      <section className="pb-16">
        {projects.map((project, index) => (
          <ProjectListItem
            key={project.id}
            id={project.id}
            title={project.title}
            tags={project.tags}
            year={project.year}
            image={project.coverImage}
            index={index}
          />
        ))}
      </section>

      {/* Outcomes CTA */}
      <section className="container-wide pb-24">
        <div className="border border-separator p-10 md:p-14 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-xl">
            <p className="text-label mb-4">Evidence-based results</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Explore the outcome data
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
              {aggregateImpact.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-5 shrink-0">
            <Link
              href="/outcomes"
              className="inline-flex items-center gap-3 text-foreground hover-highlight group"
            >
              <span className="text-sm uppercase tracking-widest">
                View full outcomes report
              </span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <button
              type="button"
              onClick={() => setBriefingOpen(true)}
              className="inline-flex items-center gap-3 text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span>Request a program briefing</span>
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </section>
      <BriefingModal
        open={briefingOpen}
        onClose={() => setBriefingOpen(false)}
        defaultProgram="general"
      />
    </Layout>
  );
};

export default Work;
