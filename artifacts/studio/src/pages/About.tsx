import { Layout } from "@/components/Layout";
import { usePageMetadata } from "@/hooks/use-page-metadata";

const focusAreas = [
  "State and federal agencies",
  "Corrections and rehabilitation",
  "Workforce development boards",
  "Violence prevention initiatives",
  "Public-sector technology programs",
];

const About = () => {
  usePageMetadata(
    "About",
    "Learn how Advanced Creation Studio builds measurable pathways from reentry to workforce opportunity through strategy, AI, and media.",
  );
  return (
    <Layout showEchelonFooter>
      <section className="container-wide py-16 md:py-24">
        <div className="max-w-3xl space-y-12">
          <div>
            <h1 className="text-display mb-8 animate-fade-in-up">Create the way forward.</h1>
            <div
              className="space-y-6 text-lg md:text-xl leading-relaxed text-muted-foreground animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <p>
                <span className="text-foreground">Advanced Creation Studio</span>{" "}
                is a government-facing strategic studio building clear,
                measurable pathways to public-sector impact.
              </p>
              <p>
                We bring strategy, messaging, turnkey media production, and
                workforce transition programs together so agencies can move
                from intention to execution with confidence.
              </p>
              <p>
                The work is grounded in the route from confinement to freedom:
                practical reentry support, stable employment, AI upskilling,
                and the tools people need to build what comes next.
              </p>
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-label mb-6">Built for</h2>
            <ul className="space-y-3">
              {focusAreas.map((area) => (
                <li key={area} className="text-lg">
                  {area}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-label mb-6">Core capabilities</h2>
            <div className="flex flex-wrap gap-3">
              {[
                "Reentry & Workforce",
                "AI Classes & Bootcamps",
                "Strategic Messaging",
                "Media Production",
                "Contract Readiness",
                "AI Governance",
              ].map((area) => (
                <span
                  key={area}
                  className="text-sm border border-border px-4 py-2"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
