import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ArrowUpRight, Landmark, Phone } from "lucide-react";
import transitionImage from "@assets/generated_images/acs-open-doorway.jpg";
import { BriefingModal } from "@/components/BriefingModal";
import { usePageMetadata } from "@/hooks/use-page-metadata";

const Contact = () => {
  const [briefingOpen, setBriefingOpen] = useState(false);

  usePageMetadata(
    "Start a Conversation",
    "Explore Advanced Creation Studio's strategic solutions for public-sector impact, workforce transition, AI education, and media.",
  );
  return (
    <Layout showEchelonFooter>
      <section className="container-wide py-16 md:py-24 min-h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-12">
            <div>
              <h1 className="text-display mb-6 animate-fade-in-up">
                Build the next
                <br />
                chapter.
              </h1>
              <p
                className="text-xl text-muted-foreground animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                Bring us the mission, the constraint, or the opportunity. We
                will help you turn it into a measurable path forward.
              </p>
            </div>

            <div
              className="space-y-6 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <a
                href="mailto:partnerships@advancedcreationstudio.com"
                className="flex items-center gap-4 text-lg hover-highlight group"
              >
                <ArrowUpRight
                  size={20}
                  className="text-muted-foreground group-hover:text-accent transition-colors"
                />
                <span>partnerships@advancedcreationstudio.com</span>
              </a>

              <a
                href="https://advancedcreationstudio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-lg hover-highlight group"
              >
                <Landmark
                  size={20}
                  className="text-muted-foreground group-hover:text-accent transition-colors"
                />
                <span>Explore program &amp; procurement information</span>
              </a>

              <div className="flex items-center gap-4 text-lg text-muted-foreground">
                <Phone size={20} />
                <span>Strategic partnerships &amp; procurement</span>
              </div>
            </div>

            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.25s" }}
            >
              <button
                type="button"
                onClick={() => setBriefingOpen(true)}
                className="inline-flex items-center gap-3 bg-foreground text-background px-6 py-3 text-sm uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity"
              >
                Request a program briefing
                <ArrowUpRight size={16} />
              </button>
              <p className="text-xs text-muted-foreground mt-3 max-w-sm leading-relaxed">
                Tell us what your agency is evaluating and we will follow up
                with a tailored conversation.
              </p>
            </div>

            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.35s" }}
            >
              <p className="text-label mb-2">Focus</p>
              <p className="text-lg">State and federal public-sector impact</p>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="aspect-[4/5] bg-secondary overflow-hidden">
              <img
                src={transitionImage}
                alt="A luminous path representing transition, possibility, and forward motion"
                className="w-full h-full object-cover"
              />
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

export default Contact;
