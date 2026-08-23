import { useParams, Redirect } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { projects } from "@/data/projects";
import { programOutcomes } from "@/data/outcomes";
import { usePageMetadata } from "@/hooks/use-page-metadata";

const WorkDetail = () => {
  const params = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === params.id);
  const hasOutcomes = programOutcomes.some((o) => o.programId === params.id);

  usePageMetadata(
    project?.title ?? "Impact Area",
    project
      ? `${project.description} Advanced Creation Studio public-sector impact area.`
      : "Explore Advanced Creation Studio's public-sector impact areas.",
    {
      path: project ? `/work/${project.id}` : "/work",
      image: project?.coverImage,
      robots: project ? "index,follow" : "noindex,follow",
      structuredData: project
        ? {
            "@type": "Service",
            name: project.title,
            description: project.description,
            provider: {
              "@type": "Organization",
              name: "Advanced Creation Studio",
            },
            serviceType: project.category,
          }
        : undefined,
    },
  );

  if (!project) {
    return <Redirect to="/work" />;
  }

  return (
    <Layout noPadding headerRevealMode showEchelonFooter>
      {/* Hero — full screen */}
      <section className="relative h-screen overflow-hidden">
        <img
          src={project.coverImage}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/50" />

        {/* Centered title */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight text-foreground text-center px-4 animate-fade-in">
            {project.title}
          </h1>
        </div>

        {/* Bottom meta bar */}
        <div className="absolute bottom-8 left-0 right-0 z-10 container-wide">
          <div className="flex justify-between items-end">
            <div className="text-label">{project.year}</div>
            <div className="flex gap-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] md:text-xs uppercase tracking-widest px-3 py-1 border border-foreground/30 text-foreground/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project info */}
      <section className="container-wide py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          {/* Sidebar details */}
          <div className="space-y-8">
            <div>
              <p className="text-label mb-2">Delivery focus</p>
              <p>{project.focus}</p>
            </div>
            <div>
              <p className="text-label mb-2">Year</p>
              <p>{project.year}</p>
            </div>
            <div>
              <p className="text-label mb-2">Categories</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm border border-separator px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="container-wide pb-24">
        <div className="space-y-8 md:space-y-12">
          {project.images.map((image, index) => (
            <div
              key={index}
              className="image-reveal animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={image}
                alt={`${project.title} — ${index + 1}`}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Outcomes CTA — shown only for programs with published outcome data */}
      {hasOutcomes && (
        <section className="container-wide pb-16">
          <div className="border border-separator p-8 md:p-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-label mb-2">Evidence-based results</p>
              <p className="text-lg md:text-xl font-display font-bold tracking-tight">
                This program has published outcome data
              </p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-sm">
                Review source-approved metrics, cohort context, and definitions
                — with comparisons to state and agency baselines.
              </p>
            </div>
            <Link
              href="/outcomes"
              className="inline-flex items-center gap-3 text-foreground hover-highlight group shrink-0"
            >
              <span className="text-sm uppercase tracking-widest">
                View outcome data
              </span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>
      )}

      {/* Back link */}
      <section className="container-wide pb-24">
        <Link
          href="/work"
          className="inline-flex items-center gap-3 text-muted-foreground hover-highlight group"
        >
          <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to impact areas</span>
        </Link>
      </section>
    </Layout>
  );
};

export default WorkDetail;
