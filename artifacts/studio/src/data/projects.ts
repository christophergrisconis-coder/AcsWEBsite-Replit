import confinementToHorizon from "@assets/generated_images/acs-confinement-to-horizon.jpg";
import openDoorway from "@assets/generated_images/acs-open-doorway.jpg";
import aiLearning from "@assets/generated_images/acs-ai-learning.jpg";
import codeBuilder from "@assets/generated_images/acs-code-builder.jpg";
import workforceLaunch from "@assets/generated_images/acs-workforce-launch.jpg";
import aiNetwork from "@assets/generated_images/acs-ai-network.jpg";
import mediaProduction from "@assets/generated_images/acs-media-production.jpg";
import achievementSummit from "@assets/generated_images/acs-achievement-summit.jpg";

export interface Project {
  id: string;
  title: string;
  category: string;
  tags: string[];
  year: string;
  focus: string;
  description: string;
  coverImage: string;
  images: string[];
  imageAlt: string;
}

export interface PartnerProof {
  id: string;
  kind: "testimonial" | "logo" | "case-study";
  title: string;
  quote?: string;
  organization?: string;
  sourceContext: string;
  context: string;
  approvalNote: string;
  sourceApproved: boolean;
  publicationApproved: boolean;
}

export const verifiedPartnerProofs: PartnerProof[] = [];

export const projects: Project[] = [
  {
    id: "reentry-pathways",
    title: "Reentry Pathways",
    category: "Workforce Transition",
    tags: ["REENTRY", "WORKFORCE"],
    year: "Flagship program",
    focus: "Recidivism reduction and sustained community integration",
    description:
      "A four-phase, evidence-based framework that connects pre-release vocational training, rapid community stabilization, direct employment placement, and continued support after release.",
    coverImage: confinementToHorizon,
    images: [confinementToHorizon],
    imageAlt: "A person moving through a dark corridor toward an open, sunlit horizon",
  },
  {
    id: "72-hour-handoff",
    title: "The 72-Hour Handoff",
    category: "Community Stabilization",
    tags: ["TRANSITION", "STABILITY"],
    year: "Reentry support",
    focus: "Immediate navigation from release to housing, services, and work",
    description:
      "A coordinated first step after release: practical navigation that helps returning citizens move from uncertainty into stable, connected support and a visible route forward.",
    coverImage: openDoorway,
    images: [openDoorway],
    imageAlt: "An open doorway leading from shadow into a warm, bright future",
  },
  {
    id: "ai-upskilling",
    title: "AI Upskilling",
    category: "AI Education",
    tags: ["AI", "TRAINING"],
    year: "Bootcamps & classes",
    focus: "Practical AI literacy for agency teams and workforce cohorts",
    description:
      "Hands-on courses that make responsible AI useful in the real world — from prompt engineering and office automation to AI governance and workforce-ready skills.",
    coverImage: aiLearning,
    images: [aiLearning],
    imageAlt: "Adult learners collaborating on laptops during an AI skills class",
  },
  {
    id: "career-tech",
    title: "Coding for Careers",
    category: "Technology Training",
    tags: ["CODING", "CAREERS"],
    year: "Workforce development",
    focus: "Career pathways built around practical digital skills",
    description:
      "Technical training that puts people in the builder’s seat, pairing foundational coding and digital tools with the confidence to compete in an evolving job market.",
    coverImage: codeBuilder,
    images: [codeBuilder],
    imageAlt: "A focused developer working at a laptop in a training studio",
  },
  {
    id: "direct-placement",
    title: "Direct Placement",
    category: "Employment Access",
    tags: ["EMPLOYMENT", "MOBILITY"],
    year: "Employer network",
    focus: "Early career connections and durable employment outcomes",
    description:
      "A career-forward approach that connects trained participants with real employers, helping transform preparation into an income, a role, and long-term momentum.",
    coverImage: workforceLaunch,
    images: [workforceLaunch],
    imageAlt: "A group leaving a training center toward a city at sunrise",
  },
  {
    id: "responsible-ai",
    title: "Responsible AI",
    category: "AI Governance",
    tags: ["NIST", "GOVERNANCE"],
    year: "Public sector",
    focus: "Human-centered systems with clearer risk and accountability",
    description:
      "AI learning and solutions designed with public-sector confidence in mind: clear governance, practical risk awareness, and outcomes people can understand.",
    coverImage: aiNetwork,
    images: [aiNetwork],
    imageAlt: "An abstract luminous network representing responsible AI coordination",
  },
  {
    id: "strategic-media",
    title: "Strategic Media",
    category: "Media Production",
    tags: ["MEDIA", "MESSAGING"],
    year: "Turnkey production",
    focus: "Clear stories and professional assets built for agency action",
    description:
      "End-to-end creative direction and media production that brings programs to life — from the central message to polished video and communication assets.",
    coverImage: mediaProduction,
    images: [mediaProduction],
    imageAlt: "A professional video production studio in use",
  },
  {
    id: "measurable-momentum",
    title: "Measurable Momentum",
    category: "Public Sector Impact",
    tags: ["OUTCOMES", "ROI"],
    year: "Evidence-based",
    focus: "Programs designed around lasting progress and accountable outcomes",
    description:
      "Impact is more than a campaign or a placement. It is a sustained route toward stability, opportunity, and outcomes agencies can stand behind.",
    coverImage: achievementSummit,
    images: [achievementSummit],
    imageAlt: "A person overlooking a city at dawn, representing achieved progress",
  },
];
