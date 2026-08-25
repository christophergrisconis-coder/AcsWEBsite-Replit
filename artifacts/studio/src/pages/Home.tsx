import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { BriefingModal } from "@/components/BriefingModal";
import { projects } from "@/data/projects";
import { usePageMetadata } from "@/hooks/use-page-metadata";

const Home = () => {
  usePageMetadata(
    "Public Sector Impact",
    "Strategic creative direction, AI education, media production, and workforce transition programs for public-sector impact.",
  );
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReduceMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  // The sequence moves from constraint and transition toward technology,
  // possibility, and measurable progress.
  const gridImages = projects.slice(0, 8).map((p) => p.coverImage);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduceMotion) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = (e.clientX - rect.left - centerX) / centerX;
    const y = (e.clientY - rect.top - centerY) / centerY;
    setMousePosition({ x, y });
  };

  return (
    <Layout hideFooter noPadding>
      <section
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative h-screen overflow-hidden"
      >
        {/* Parallax image grid background */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out"
          style={{
            transform: reduceMotion
              ? "none"
              : `translate(${-mousePosition.x * 40}px, ${-mousePosition.y * 40}px)`,
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 p-12 md:p-16 w-full max-w-7xl">
            {gridImages.map((image, index) => (
              <div key={index} className="aspect-[3/4] overflow-hidden">
                <img
                  src={image}
                  alt={projects[index]?.imageAlt ?? "Advanced Creation Studio visual"}
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Subtle overlay for text legibility */}
        <div className="absolute inset-0 bg-background/30" />

        {/* Centered title */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight text-foreground">
            Advanced Creation
          </h1>
        </div>

        {/* Bio — bottom left */}
        <div className="absolute bottom-8 md:bottom-12 left-6 md:left-12 z-10 max-w-xs md:max-w-sm">
          <p className="text-sm md:text-base font-sans text-foreground/80 leading-relaxed">
            We turn complex public-sector challenges into clear, contract-ready
            solutions — from reentry and workforce transition to AI education,
            strategic messaging, and media production.
          </p>
          <button
            type="button"
            onClick={() => setBriefingOpen(true)}
            className="mt-5 inline-flex items-center gap-3 text-sm uppercase tracking-widest text-foreground hover-highlight group"
          >
            <span>Request a program briefing</span>
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </section>

      {/* Organization overview */}
      <section className="border-t border-separator">
        <div className="container-wide py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
            <div>
              <p className="text-label mb-4">The work</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Reentry with dignity. Results with purpose.
              </h2>
            </div>
            <div className="lg:col-span-2 space-y-6 text-lg md:text-xl leading-relaxed text-muted-foreground">
              <p>
                Advanced Creation Studio is a nonprofit workforce-development
                organization helping public-sector and community partners turn
                hard transitions into practical routes forward.
              </p>
              <p>
                We connect reentry education and life-readiness coaching with
                mentorship, wraparound support, direct employment pathways, and
                training in coding, AI, and digital work. The aim is not simply
                release or placement—it is durable stability, income, and
                achievement.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 text-sm uppercase tracking-widest text-foreground hover-highlight group"
              >
                <span>Read the ACS story</span>
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Program pillars */}
      <section className="bg-accent/30 border-y border-separator">
        <div className="container-wide py-20 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="text-label mb-4">Three connected pillars</p>
              <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
                A pathway, not a handoff.
              </h2>
            </div>
            <p className="max-w-sm text-muted-foreground leading-relaxed">
              Every program is designed to move people from preparation to
              participation, and from participation to measurable progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-separator">
            <article className="bg-background p-8 md:p-10">
              <p className="text-label text-accent mb-8">01</p>
              <h3 className="font-display text-2xl font-bold tracking-tight mb-4">
                Reentry education
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Life-readiness coaching and practical preparation that help
                returning citizens build confidence, direction, and a
                credible next step.
              </p>
            </article>
            <article className="bg-background p-8 md:p-10">
              <p className="text-label text-accent mb-8">02</p>
              <h3 className="font-display text-2xl font-bold tracking-tight mb-4">
                Reintegration support
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Mentorship, wraparound community support, and direct
                stakeholder engagement that make the first days and months
                after release more navigable.
              </p>
            </article>
            <article className="bg-background p-8 md:p-10">
              <p className="text-label text-accent mb-8">03</p>
              <h3 className="font-display text-2xl font-bold tracking-tight mb-4">
                AI and workforce readiness
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Coding, AI literacy, digital entrepreneurship, and
                employment-focused training aligned to high-growth opportunity.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="container-wide py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4">
            <p className="text-label mb-4">Built for execution</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Strategy that can leave the page.
            </h2>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-separator">
            <article className="bg-background border border-separator p-8">
              <p className="text-label text-accent mb-6">01 / Message</p>
              <h3 className="font-display text-2xl font-bold tracking-tight mb-3">
                Strategic messaging
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Positioning, narrative systems, and communications built for
                agency partners, RFP reuse, and clear public understanding.
              </p>
            </article>
            <article className="bg-background border border-separator p-8">
              <p className="text-label text-accent mb-6">02 / Make</p>
              <h3 className="font-display text-2xl font-bold tracking-tight mb-3">
                Media production
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Human-centered stories and production support that make complex
                programs visible, credible, and easier to engage with.
              </p>
            </article>
            <article className="bg-background border border-separator p-8">
              <p className="text-label text-accent mb-6">03 / Ready</p>
              <h3 className="font-display text-2xl font-bold tracking-tight mb-3">
                Contract readiness
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                A disciplined creative standard for federal and state partners:
                consistent, compliance-aware, and ready for the next review.
              </p>
            </article>
            <article className="bg-background border border-separator p-8">
              <p className="text-label text-accent mb-6">04 / Build</p>
              <h3 className="font-display text-2xl font-bold tracking-tight mb-3">
                Digital products
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Responsive web and mobile tools that turn curriculum,
                progress, and participant support into usable systems.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Founder and partner value */}
      <section className="container-wide py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <p className="text-label mb-4">Built to carry the standard</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-8">
              Experience that moves between systems.
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
              Founder and Executive Director Christopher Grisconis brings nine
              years of consultative sales and business ownership together with
              a decade of high-accountability institutional operations and
              hands-on software development.
            </p>
          </div>

          <div className="space-y-8">
            <p className="text-lg leading-relaxed">
              That combination shapes how ACS works with agencies, community
              organizations, and employers: listen closely, design for the
              actual constraint, communicate with precision, and finish to a
              standard partners can stand behind.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-separator">
              <div className="bg-background border border-separator p-6">
                <p className="font-display text-3xl font-bold">9 yrs</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2 leading-snug">
                  consultative sales &amp; business ownership
                </p>
              </div>
              <div className="bg-background border border-separator p-6">
                <p className="font-display text-3xl font-bold">10 yrs</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2 leading-snug">
                  high-accountability operations
                </p>
              </div>
              <div className="bg-background border border-separator p-6">
                <p className="font-display text-3xl font-bold">7+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2 leading-snug">
                  interactive software products shipped
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <Link
                href="/work"
                className="inline-flex items-center gap-3 text-sm uppercase tracking-widest text-foreground hover-highlight group"
              >
                <span>Explore impact areas</span>
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/outcomes"
                className="inline-flex items-center gap-3 text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
              >
                <span>Review outcomes</span>
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
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

export default Home;
