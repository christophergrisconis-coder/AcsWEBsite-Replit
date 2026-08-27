import { FormEvent, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { usePageMetadata } from "@/hooks/use-page-metadata";

type TerminalEntry = {
  id: number;
  command: string;
  output: string;
};

type TerminalMode = "practice" | "real";
type TerminalTab = "terminal" | "themes" | "terminology" | "tutor";

type StatusResponse = {
  enabled: boolean;
  root: string;
  allowedCommands: string[];
  maxTimeoutMs: number;
  error?: string;
};

type ExecuteResponse = {
  command: string;
  args: string[];
  cwd: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut?: boolean;
  durationMs: number;
  why?: string;
  error?: string;
};

type TutorResponse = {
  question: string;
  answer: string;
  error?: string;
};

type Term = {
  abbr: string;
  expanded: string;
  definition: string;
};

type CinematicPreset = {
  id: string;
  name: string;
  description: string;
  why: string;
  gradient: string;
  glowColor: string;
  particleColor: string;
  motionSeconds: number;
};

const terminology: Term[] = [
  { abbr: "API", expanded: "Application Programming Interface", definition: "A contract for how software components communicate." },
  { abbr: "SDK", expanded: "Software Development Kit", definition: "A toolkit with libraries, docs, and tools to build for a platform." },
  { abbr: "CLI", expanded: "Command Line Interface", definition: "A text-based interface for running commands." },
  { abbr: "GUI", expanded: "Graphical User Interface", definition: "Visual interface using windows, buttons, and menus." },
  { abbr: "IDE", expanded: "Integrated Development Environment", definition: "Editor + debugger + tooling in one app." },
  { abbr: "REPL", expanded: "Read-Eval-Print Loop", definition: "Interactive coding shell that evaluates code immediately." },
  { abbr: "PATH", expanded: "Executable Search Path", definition: "Environment variable listing directories to find commands." },
  { abbr: "ENV", expanded: "Environment Variables", definition: "Key-value runtime settings provided to programs." },
  { abbr: "STDIN", expanded: "Standard Input", definition: "Default input stream, usually keyboard or piped data." },
  { abbr: "STDOUT", expanded: "Standard Output", definition: "Default output stream for normal command results." },
  { abbr: "STDERR", expanded: "Standard Error", definition: "Separate output stream for errors and diagnostics." },
  { abbr: "OOP", expanded: "Object-Oriented Programming", definition: "Programming paradigm based on objects/classes." },
  { abbr: "FP", expanded: "Functional Programming", definition: "Programming style emphasizing pure functions and immutability." },
  { abbr: "DRY", expanded: "Don't Repeat Yourself", definition: "Avoid duplicated logic; centralize shared behavior." },
  { abbr: "KISS", expanded: "Keep It Simple, Stupid", definition: "Prefer simple implementations over unnecessary complexity." },
  { abbr: "YAGNI", expanded: "You Aren't Gonna Need It", definition: "Do not add features before they are required." },
  { abbr: "SOLID", expanded: "Five Object Design Principles", definition: "Guidelines for maintainable object-oriented design." },
  { abbr: "TDD", expanded: "Test-Driven Development", definition: "Write tests first, then implement code to pass." },
  { abbr: "BDD", expanded: "Behavior-Driven Development", definition: "Specification-style development focused on behavior outcomes." },
  { abbr: "CI", expanded: "Continuous Integration", definition: "Automated testing/building on frequent code changes." },
  { abbr: "CD", expanded: "Continuous Delivery/Deployment", definition: "Automated release pipeline to staging/production." },
  { abbr: "VCS", expanded: "Version Control System", definition: "Tracks file history and supports collaboration." },
  { abbr: "SCM", expanded: "Source Control Management", definition: "Processes/tools for tracking code changes." },
  { abbr: "PR", expanded: "Pull Request", definition: "Proposed code change for review and merge." },
  { abbr: "MR", expanded: "Merge Request", definition: "GitLab term similar to pull request." },
  { abbr: "SHA", expanded: "Secure Hash Algorithm", definition: "Hash used by Git to identify objects/commits." },
  { abbr: "HEAD", expanded: "Current Commit Pointer", definition: "Reference to your current checkout location in Git." },
  { abbr: "LTS", expanded: "Long-Term Support", definition: "Stable software release with extended support period." },
  { abbr: "SEMVER", expanded: "Semantic Versioning", definition: "Version format: major.minor.patch with compatibility meaning." },
  { abbr: "AST", expanded: "Abstract Syntax Tree", definition: "Tree representation of parsed code structure." },
  { abbr: "DOM", expanded: "Document Object Model", definition: "Browser representation of HTML as a node tree." },
  { abbr: "SPA", expanded: "Single-Page Application", definition: "Web app that updates UI without full page reload." },
  { abbr: "SSR", expanded: "Server-Side Rendering", definition: "Render HTML on server before sending to browser." },
  { abbr: "CSR", expanded: "Client-Side Rendering", definition: "Render UI in browser using JavaScript." },
  { abbr: "SSG", expanded: "Static Site Generation", definition: "Pre-build HTML files for fast, cacheable delivery." },
  { abbr: "PWA", expanded: "Progressive Web App", definition: "Installable web app with offline and app-like features." },
  { abbr: "HTTP", expanded: "HyperText Transfer Protocol", definition: "Core protocol for web request/response communication." },
  { abbr: "HTTPS", expanded: "HTTP Secure", definition: "Encrypted HTTP using TLS." },
  { abbr: "TLS", expanded: "Transport Layer Security", definition: "Encryption protocol for secure network communication." },
  { abbr: "CORS", expanded: "Cross-Origin Resource Sharing", definition: "Browser policy for cross-domain requests." },
  { abbr: "REST", expanded: "Representational State Transfer", definition: "Resource-oriented API style over HTTP." },
  { abbr: "RPC", expanded: "Remote Procedure Call", definition: "Call remote functions/services like local calls." },
  { abbr: "GraphQL", expanded: "Query Language for APIs", definition: "Client requests exactly the data it needs." },
  { abbr: "JSON", expanded: "JavaScript Object Notation", definition: "Common lightweight data format for APIs/config." },
  { abbr: "YAML", expanded: "YAML Ain't Markup Language", definition: "Human-readable config/data serialization format." },
  { abbr: "XML", expanded: "Extensible Markup Language", definition: "Structured markup format for data exchange." },
  { abbr: "SQL", expanded: "Structured Query Language", definition: "Language for relational database operations." },
  { abbr: "ORM", expanded: "Object-Relational Mapper", definition: "Maps database tables/rows to code objects/models." },
  { abbr: "CRUD", expanded: "Create Read Update Delete", definition: "Four fundamental data operations." },
  { abbr: "ACID", expanded: "Atomicity Consistency Isolation Durability", definition: "Core transactional guarantees in relational DBs." },
  { abbr: "CAP", expanded: "Consistency Availability Partition Tolerance", definition: "Distributed system tradeoff model." },
  { abbr: "JWT", expanded: "JSON Web Token", definition: "Signed token carrying user/session claims." },
  { abbr: "OAuth", expanded: "Open Authorization", definition: "Authorization framework delegating access without password sharing." },
  { abbr: "OIDC", expanded: "OpenID Connect", definition: "Identity layer built on top of OAuth 2.0." },
  { abbr: "SSO", expanded: "Single Sign-On", definition: "One identity login across multiple apps/services." },
  { abbr: "MFA", expanded: "Multi-Factor Authentication", definition: "Login requiring multiple verification factors." },
  { abbr: "RBAC", expanded: "Role-Based Access Control", definition: "Access permissions based on user roles." },
  { abbr: "IaC", expanded: "Infrastructure as Code", definition: "Manage cloud/server infrastructure via code." },
  { abbr: "VM", expanded: "Virtual Machine", definition: "Software-emulated computer environment." },
  { abbr: "Container", expanded: "OS-Level Isolated Runtime", definition: "Packaged app runtime with dependencies and isolation." },
  { abbr: "Docker", expanded: "Container Platform", definition: "Popular toolchain for building/running containers." },
  { abbr: "K8s", expanded: "Kubernetes", definition: "Container orchestration platform for scaling and ops." },
  { abbr: "CDN", expanded: "Content Delivery Network", definition: "Distributed edge servers for fast content delivery." },
  { abbr: "DNS", expanded: "Domain Name System", definition: "Resolves domain names to network addresses." },
  { abbr: "SRE", expanded: "Site Reliability Engineering", definition: "Engineering discipline for reliability and operational excellence." },
  { abbr: "RCA", expanded: "Root Cause Analysis", definition: "Structured process to identify incident causes." },
  { abbr: "SLA", expanded: "Service Level Agreement", definition: "Contracted performance/availability commitment." },
  { abbr: "SLO", expanded: "Service Level Objective", definition: "Internal reliability target metric." },
  { abbr: "SLI", expanded: "Service Level Indicator", definition: "Measured value used to track reliability." },
  { abbr: "UX", expanded: "User Experience", definition: "Overall quality and usability of user interaction." },
  { abbr: "UI", expanded: "User Interface", definition: "Visual controls and layout users directly interact with." },
  { abbr: "A11Y", expanded: "Accessibility", definition: "Inclusive design for users with varied abilities." },
  { abbr: "FPS", expanded: "Frames Per Second", definition: "Animation/rendering smoothness metric." },
  { abbr: "ETA", expanded: "Estimated Time of Arrival", definition: "Projected completion or delivery time." },
];

const cinematicPresets: CinematicPreset[] = [
  {
    id: "midnight-orbit",
    name: "Midnight Orbit",
    description: "Dark blue cinematic backdrop with slow drifting glow and subtle particle arc.",
    why: "Great for dashboard hero sections where readability and depth both matter.",
    gradient: "radial-gradient(circle at 20% 10%, #1b2a4a 0%, #0f1729 45%, #05070f 100%)",
    glowColor: "rgba(93, 135, 255, 0.45)",
    particleColor: "rgba(154, 187, 255, 0.35)",
    motionSeconds: 18,
  },
  {
    id: "neon-drift",
    name: "Neon Drift",
    description: "Purple-cyan blend with brighter sweep for futuristic launch pages.",
    why: "Use when you want more energy and product-launch excitement.",
    gradient: "linear-gradient(135deg, #160b2f 0%, #211044 40%, #032533 100%)",
    glowColor: "rgba(110, 255, 239, 0.35)",
    particleColor: "rgba(196, 138, 255, 0.35)",
    motionSeconds: 14,
  },
  {
    id: "sunset-haze",
    name: "Sunset Haze",
    description: "Warm cinematic tone with amber-magenta bloom and long parallax travel.",
    why: "Best for storytelling pages and portfolios with emotional visual pacing.",
    gradient: "linear-gradient(145deg, #2a1820 0%, #46233b 45%, #1c203f 100%)",
    glowColor: "rgba(255, 173, 104, 0.35)",
    particleColor: "rgba(255, 226, 164, 0.3)",
    motionSeconds: 20,
  },
];

function generateSnippet(kind: string, name?: string): string {
  const safeName = name?.replace(/[^a-zA-Z0-9_-]/g, "") || "example";
  switch (kind) {
    case "react-component":
      return `// ${safeName}.tsx\nexport function ${safeName[0]?.toUpperCase()}${safeName.slice(1)}() {\n  return <section>Hello from ${safeName}</section>;\n}`;
    case "express-route":
      return `import { Router } from "express";\n\nconst router = Router();\nrouter.get("/${safeName}", (_req, res) => {\n  res.json({ ok: true, route: "${safeName}" });\n});\n\nexport default router;`;
    case "python-script":
      return `#!/usr/bin/env python3\n\ndef main() -> None:\n    print("Hello from ${safeName}")\n\nif __name__ == "__main__":\n    main()`;
    case "bash-pdf-pipeline":
      return `# Convert text to PDF with a PostScript pipeline\nenscript ${safeName}.txt --output=- | ps2pdf - > ${safeName}.pdf`;
    case "zip-command":
      return `zip -r ${safeName}.zip ${safeName}/`;
    default:
      return `Unknown template "${kind}". Try: react-component, express-route, python-script, bash-pdf-pipeline, zip-command`;
  }
}

function buildThemeSnippet(preset: CinematicPreset): string {
  return `/* ${preset.name} cinematic background */
.cinematic-stage {
  position: relative;
  overflow: hidden;
  background: ${preset.gradient};
  min-height: 420px;
}

.cinematic-glow,
.cinematic-particles {
  position: absolute;
  inset: -20%;
  pointer-events: none;
}

.cinematic-glow {
  background: radial-gradient(circle, ${preset.glowColor} 0%, rgba(0, 0, 0, 0) 60%);
  filter: blur(36px);
  animation: drift ${preset.motionSeconds}s ease-in-out infinite alternate;
}

.cinematic-particles {
  background:
    radial-gradient(circle at 20% 30%, ${preset.particleColor} 0 2px, transparent 3px),
    radial-gradient(circle at 60% 65%, ${preset.particleColor} 0 2px, transparent 3px),
    radial-gradient(circle at 80% 25%, ${preset.particleColor} 0 2px, transparent 3px);
  animation: sweep ${Math.max(8, Math.floor(preset.motionSeconds * 0.7))}s linear infinite;
}

@keyframes drift {
  0% { transform: translate3d(-4%, -2%, 0) scale(1); }
  100% { transform: translate3d(5%, 3%, 0) scale(1.08); }
}

@keyframes sweep {
  0% { transform: translateX(-2%); opacity: 0.4; }
  50% { opacity: 0.7; }
  100% { transform: translateX(2%); opacity: 0.4; }
}

@media (prefers-reduced-motion: reduce) {
  .cinematic-glow,
  .cinematic-particles {
    animation: none;
  }
}`;
}

function runPracticeCommand(rawInput: string): { output: string; clear?: boolean } {
  const input = rawInput.trim();
  if (!input) return { output: "Type a command. Run `help` to start." };

  const [command, ...args] = input.split(/\s+/);
  const normalized = command.toLowerCase();

  if (normalized === "help") {
    return {
      output:
        "Practice mode commands:\n- help\n- clear\n- lesson shell\n- lesson streams\n- lesson pdf\n- lesson git\n- lesson cinematic\n- explain <abbr>\n- generate <template> [name]\n- why <command>\n- resources",
    };
  }
  if (normalized === "clear") return { output: "Terminal cleared.", clear: true };

  if (normalized === "lesson") {
    const lesson = args[0];
    if (lesson === "shell") {
      return { output: "Shell lesson:\nInput -> parsing -> expansion -> PATH lookup -> execution.\nTry: echo $USER && which git" };
    }
    if (lesson === "streams") {
      return { output: "Streams lesson:\nstdin=0 stdout=1 stderr=2.\nTry: cat file.txt | grep text > out.txt 2> err.log" };
    }
    if (lesson === "pdf") {
      return { output: "PDF lesson:\nUse reproducible conversion pipelines.\nExample: enscript notes.txt --output=- | ps2pdf - > notes.pdf" };
    }
    if (lesson === "git") {
      return { output: "Git lesson:\nTrack snapshots and publish safely.\nFlow: git init -> git add . -> git commit -m \"msg\" -> git push" };
    }
    if (lesson === "cinematic") {
      return {
        output:
          "Cinematic motion lesson:\n1) Build layered backgrounds.\n2) Animate opacity/transform slowly.\n3) Add pointer-based parallax.\n4) Respect prefers-reduced-motion.",
      };
    }
    return { output: "Usage: lesson <shell|streams|pdf|git|cinematic>" };
  }

  if (normalized === "explain") {
    const topic = args.join(" ").trim().toUpperCase();
    const found = terminology.find((entry) => entry.abbr === topic);
    if (!found) return { output: `No glossary entry for "${topic}".` };
    return { output: `${found.abbr} — ${found.expanded}\n${found.definition}` };
  }

  if (normalized === "generate") {
    const template = args[0];
    const name = args[1];
    if (!template) return { output: "Usage: generate <template> [name]" };
    return { output: generateSnippet(template, name) };
  }

  if (normalized === "why") {
    const action = args.join(" ");
    if (!action) return { output: "Usage: why <command or workflow>" };
    return {
      output:
        `Why "${action}":\nWe execute commands to make actions explicit, repeatable, and automatable.\nThis prevents hidden state and improves debugging, teamwork, and deployment reliability.`,
    };
  }

  if (normalized === "resources") {
    return {
      output:
        "Learning goals in this app:\n- Understand command purpose.\n- Build/push code safely.\n- Use Git/GitHub workflows.\n- Create motion-rich themes with performance and accessibility in mind.",
    };
  }

  return { output: `Unknown command "${command}". Run \`help\`.` };
}

function formatRealResponse(response: ExecuteResponse): string {
  const blocks = [
    response.stdout.trim(),
    response.stderr.trim(),
    response.why ? `Why: ${response.why}` : "",
    `[exit ${response.exitCode}] ${response.durationMs}ms${response.timedOut ? " (timed out)" : ""}`,
  ].filter(Boolean);
  return blocks.join("\n\n");
}

function createSessionSecret(): string {
  const bytes = new Uint8Array(48);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

export default function TerminalLab() {
  usePageMetadata(
    "Terminal Teaching Lab",
    "Interactive terminal with practice mode, real sandbox mode, GitHub workflows, terminology glossary, and tutor answers.",
  );

  const [tab, setTab] = useState<TerminalTab>("terminal");
  const [mode, setMode] = useState<TerminalMode>("practice");
  const [input, setInput] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [sandboxRoot, setSandboxRoot] = useState<string | null>(null);
  const [sandboxCwd, setSandboxCwd] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [allowedCommands, setAllowedCommands] = useState<string[] | null>(null);
  const [repoName, setRepoName] = useState("terminal-practice-lab");
  const [repoVisibility, setRepoVisibility] = useState<"private" | "public">("private");
  const [firstCommitMessage, setFirstCommitMessage] = useState("Initial commit from Terminal Teaching Lab");
  const [generatedSecret, setGeneratedSecret] = useState("");
  const [tutorQuestion, setTutorQuestion] = useState("");
  const [tutorAnswer, setTutorAnswer] = useState("");
  const [termQuery, setTermQuery] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState(cinematicPresets[0].id);
  const [history, setHistory] = useState<TerminalEntry[]>([
    {
      id: 1,
      command: "welcome",
      output:
        "Terminal Teaching Lab is ready.\nUse Practice Mode for guided learning.\nUse Real Sandbox Mode to run real commands only inside your external-drive sandbox.",
    },
  ]);

  const quickCommands = useMemo(
    () =>
      mode === "practice"
        ? ["help", "lesson shell", "lesson streams", "lesson cinematic", "generate react-component heroPanel", "why git commit"]
        : ["pwd", "ls", "git status", "pnpm --version", "node --version", "gh auth status"],
    [mode],
  );

  const filteredTerms = useMemo(() => {
    const q = termQuery.trim().toLowerCase();
    if (!q) return terminology;
    return terminology.filter(
      (item) =>
        item.abbr.toLowerCase().includes(q) ||
        item.expanded.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q),
    );
  }, [termQuery]);

  const selectedTheme = useMemo(
    () =>
      cinematicPresets.find((preset) => preset.id === selectedThemeId) ??
      cinematicPresets[0],
    [selectedThemeId],
  );

  const pushEntry = (command: string, output: string) => {
    setHistory((previous) => [...previous, { id: Date.now(), command, output }]);
  };

  const clearTerminal = (command: string, output: string) => {
    setHistory([{ id: Date.now(), command, output }]);
  };

  const connectRealMode = async () => {
    if (!adminToken.trim()) {
      pushEntry("connect", "Provide your admin token (SESSION_SECRET) first.");
      return;
    }

    setIsConnecting(true);
    try {
      const response = await fetch("/api/terminal-lab/status", {
        headers: { "x-admin-token": adminToken.trim() },
      });
      const payload = (await response.json()) as StatusResponse;
      if (!response.ok || !payload.enabled) {
        pushEntry("connect", payload.error ?? "Unable to connect to sandbox terminal mode.");
        return;
      }
      setSandboxRoot(payload.root);
      setSandboxCwd(payload.root);
      setAllowedCommands(payload.allowedCommands);
      pushEntry(
        "connect",
        `Connected to sandbox root:\n${payload.root}\nAllowed commands:\n${payload.allowedCommands.join(", ")}`,
      );
    } catch (error) {
      pushEntry("connect", error instanceof Error ? `Connection failed: ${error.message}` : "Connection failed.");
    } finally {
      setIsConnecting(false);
    }
  };

  const executeRealCommand = async (command: string) => {
    if (!adminToken.trim()) {
      pushEntry(command, "Missing admin token. Enter SESSION_SECRET and connect first.");
      return;
    }
    if (!sandboxCwd) {
      pushEntry(command, "Real mode is not connected. Click Connect Real Terminal.");
      return;
    }

    setIsExecuting(true);
    try {
      const response = await fetch("/api/terminal-lab/execute", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-admin-token": adminToken.trim(),
        },
        body: JSON.stringify({
          input: command,
          cwd: sandboxCwd,
          timeoutMs: 20000,
        }),
      });
      const payload = (await response.json()) as ExecuteResponse;
      if (!response.ok) {
        pushEntry(command, payload.error ?? "Command failed.");
        return;
      }
      setSandboxCwd(payload.cwd);
      pushEntry(command, formatRealResponse(payload));
    } catch (error) {
      pushEntry(command, error instanceof Error ? `Command failed: ${error.message}` : "Command failed.");
    } finally {
      setIsExecuting(false);
    }
  };

  const runSequence = async (commands: string[]) => {
    for (const command of commands) {
      await executeRealCommand(command);
    }
  };

  const runGitHubAction = async (action: "init" | "commit" | "createRepo" | "push") => {
    if (action === "init") {
      await runSequence(["git init", "git status"]);
      return;
    }
    if (action === "commit") {
      await runSequence([`git add .`, `git commit -m "${firstCommitMessage.replace(/"/g, "'")}"`]);
      return;
    }
    if (action === "createRepo") {
      await runSequence([
        `gh repo create ${repoName} --${repoVisibility} --source=. --remote=origin`,
        "git remote -v",
      ]);
      return;
    }
    await runSequence(["git push -u origin main"]);
  };

  const askTutor = async () => {
    if (!adminToken.trim()) {
      setTutorAnswer("Enter your admin token (SESSION_SECRET) first.");
      return;
    }
    if (!tutorQuestion.trim()) {
      setTutorAnswer("Ask a question first.");
      return;
    }
    try {
      const response = await fetch("/api/terminal-lab/tutor", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-admin-token": adminToken.trim(),
        },
        body: JSON.stringify({ question: tutorQuestion.trim() }),
      });
      const payload = (await response.json()) as TutorResponse;
      if (!response.ok) {
        setTutorAnswer(payload.error ?? "Tutor request failed.");
        return;
      }
      setTutorAnswer(payload.answer);
    } catch (error) {
      setTutorAnswer(error instanceof Error ? error.message : "Tutor request failed.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextInput = input.trim();
    if (!nextInput) return;
    setInput("");

    if (nextInput.toLowerCase() === "clear") {
      clearTerminal(nextInput, "Terminal cleared.");
      return;
    }

    if (mode === "practice") {
      const result = runPracticeCommand(nextInput);
      if (result.clear) {
        clearTerminal(nextInput, result.output);
      } else {
        pushEntry(nextInput, result.output);
      }
      return;
    }

    await executeRealCommand(nextInput);
  };

  return (
    <Layout>
      <section className="container-wide py-16 md:py-24 space-y-10">
        <header className="max-w-4xl space-y-4">
          <p className="text-label">Interactive Learning App</p>
          <h1 className="text-display">Terminal Teaching Lab</h1>
          <p className="text-lg text-muted-foreground">
            Learn by doing: run commands in a safe sandbox, understand why each action matters,
            use built-in GitHub workflows, and study coding terms in one place.
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab("terminal")}
            className={`text-xs px-3 py-2 border ${tab === "terminal" ? "border-foreground" : "border-border"}`}
          >
            Terminal
          </button>
          <button
            type="button"
            onClick={() => setTab("themes")}
            className={`text-xs px-3 py-2 border ${tab === "themes" ? "border-foreground" : "border-border"}`}
          >
            Theme Studio
          </button>
          <button
            type="button"
            onClick={() => setTab("terminology")}
            className={`text-xs px-3 py-2 border ${tab === "terminology" ? "border-foreground" : "border-border"}`}
          >
            Glossary
          </button>
          <button
            type="button"
            onClick={() => setTab("tutor")}
            className={`text-xs px-3 py-2 border ${tab === "tutor" ? "border-foreground" : "border-border"}`}
          >
            AI Tutor
          </button>
        </div>

        {tab === "terminal" && (
          <>
            <div className="border border-separator p-4 md:p-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMode("practice")}
                  className={`text-xs px-3 py-2 border ${mode === "practice" ? "border-foreground" : "border-border"}`}
                >
                  Practice Mode
                </button>
                <button
                  type="button"
                  onClick={() => setMode("real")}
                  className={`text-xs px-3 py-2 border ${mode === "real" ? "border-foreground" : "border-border"}`}
                >
                  Real Sandbox Mode
                </button>
              </div>

              {mode === "real" && (
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground">
                    Admin token (SESSION_SECRET)
                  </label>
                  <input
                    type="password"
                    value={adminToken}
                    onChange={(event) => setAdminToken(event.target.value)}
                    placeholder="Enter admin token"
                    className="w-full max-w-xl border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={connectRealMode}
                      disabled={isConnecting}
                      className="text-xs border border-foreground px-3 py-2 disabled:opacity-60"
                    >
                      {isConnecting ? "Connecting..." : "Connect Real Terminal"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGeneratedSecret(createSessionSecret())}
                      className="text-xs border border-border px-3 py-2"
                    >
                      Generate new SESSION_SECRET
                    </button>
                  </div>
                  {generatedSecret && (
                    <p className="text-xs break-all text-muted-foreground">
                      Generated SESSION_SECRET: {generatedSecret}
                    </p>
                  )}
                  {sandboxRoot && (
                    <p className="text-xs text-muted-foreground">Sandbox root: {sandboxRoot}</p>
                  )}
                  {sandboxCwd && (
                    <p className="text-xs text-muted-foreground">Current directory: {sandboxCwd}</p>
                  )}
                  {allowedCommands && (
                    <p className="text-xs text-muted-foreground">
                      Allowed commands: {allowedCommands.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 border border-separator bg-black text-green-300 min-h-[26rem] font-mono text-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-green-900/60 bg-black/70">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-300/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <p className="text-[11px] tracking-wider uppercase text-green-500/90">
                    terminal-lab.preview
                  </p>
                </div>
                <div className="p-4 md:p-6">
                <div className="space-y-5 max-h-[26rem] overflow-y-auto pr-2">
                  {history.map((entry) => (
                    <div key={entry.id} className="space-y-2">
                      <p>
                        <span className="text-green-500">$</span> {entry.command}
                      </p>
                      <pre className="whitespace-pre-wrap text-green-200">{entry.output}</pre>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSubmit} className="mt-6 flex items-center gap-3">
                  <span className="text-green-500">$</span>
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={
                      mode === "practice"
                        ? "Type a practice command in English..."
                        : "Type a real sandbox command..."
                    }
                    className="w-full bg-transparent border border-green-700/70 px-3 py-2 text-green-100 focus:outline-none focus:border-green-400"
                    aria-label="Terminal command input"
                  />
                  <button
                    type="submit"
                    disabled={isExecuting}
                    className="border border-green-700/70 px-3 py-2 text-xs text-green-200 disabled:opacity-60"
                  >
                    {isExecuting ? "Running..." : "Run"}
                  </button>
                </form>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="border border-separator p-4 md:p-6 space-y-4">
                  <h2 className="font-display text-2xl">Quick commands</h2>
                  <div className="flex flex-wrap gap-2">
                    {quickCommands.map((command) => (
                      <button
                        key={command}
                        type="button"
                        onClick={() => setInput(command)}
                        className="text-xs border border-border px-3 py-2 hover:border-foreground transition-colors"
                      >
                        {command}
                      </button>
                    ))}
                  </div>
                </div>

                {mode === "real" && (
                  <div className="border border-separator p-4 md:p-6 space-y-4">
                    <h2 className="font-display text-2xl">GitHub integration</h2>
                    <p className="text-xs text-muted-foreground">
                      One-click helpers for local Git and GitHub CLI workflows.
                    </p>
                    <div className="space-y-3">
                      <input
                        value={repoName}
                        onChange={(event) => setRepoName(event.target.value)}
                        placeholder="repo-name"
                        className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                      />
                      <select
                        value={repoVisibility}
                        onChange={(event) =>
                          setRepoVisibility(event.target.value as "private" | "public")
                        }
                        className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                      >
                        <option value="private">private</option>
                        <option value="public">public</option>
                      </select>
                      <input
                        value={firstCommitMessage}
                        onChange={(event) => setFirstCommitMessage(event.target.value)}
                        placeholder="First commit message"
                        className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => runGitHubAction("init")} className="text-xs border border-border px-3 py-2">
                        Init repo
                      </button>
                      <button type="button" onClick={() => runGitHubAction("commit")} className="text-xs border border-border px-3 py-2">
                        First commit
                      </button>
                      <button type="button" onClick={() => runGitHubAction("createRepo")} className="text-xs border border-border px-3 py-2">
                        Create GitHub repo
                      </button>
                      <button type="button" onClick={() => runGitHubAction("push")} className="text-xs border border-border px-3 py-2">
                        Push main
                      </button>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </>
        )}

        {tab === "themes" && (
          <section className="space-y-6">
            <style>{`
              @keyframes cinematicFloat {
                0% { transform: translate3d(-5%, -3%, 0) scale(1); }
                100% { transform: translate3d(6%, 4%, 0) scale(1.08); }
              }
              @keyframes cinematicSweep {
                0% { transform: translate3d(-2%, 0, 0); opacity: 0.4; }
                50% { opacity: 0.75; }
                100% { transform: translate3d(2%, 0, 0); opacity: 0.4; }
              }
            `}</style>
            <div className="border border-separator p-4 md:p-6 space-y-4">
              <h2 className="font-display text-3xl">Cinematic theme builder</h2>
              <p className="text-sm text-muted-foreground">
                Pick a preset, preview motion layers, and copy starter CSS for your own project.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {cinematicPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedThemeId(preset.id)}
                    className={`text-left border px-3 py-3 transition-colors ${
                      selectedTheme.id === preset.id
                        ? "border-foreground"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    <p className="font-semibold">{preset.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className="relative min-h-[360px] overflow-hidden border border-separator"
                style={{ background: selectedTheme.gradient }}
              >
                <div
                  className="absolute inset-[-15%]"
                  style={{
                    background: `radial-gradient(circle, ${selectedTheme.glowColor} 0%, rgba(0,0,0,0) 60%)`,
                    filter: "blur(32px)",
                    animation: `cinematicFloat ${selectedTheme.motionSeconds}s ease-in-out infinite alternate`,
                  }}
                />
                <div
                  className="absolute inset-[-10%]"
                  style={{
                    background: `radial-gradient(circle at 20% 30%, ${selectedTheme.particleColor} 0 2px, transparent 3px),
                      radial-gradient(circle at 62% 58%, ${selectedTheme.particleColor} 0 2px, transparent 3px),
                      radial-gradient(circle at 80% 20%, ${selectedTheme.particleColor} 0 2px, transparent 3px)`,
                    animation: `cinematicSweep ${Math.max(
                      8,
                      Math.floor(selectedTheme.motionSeconds * 0.7),
                    )}s linear infinite`,
                  }}
                />
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="max-w-sm space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">Preset</p>
                    <h3 className="font-display text-3xl text-white">{selectedTheme.name}</h3>
                    <p className="text-sm text-white/80">{selectedTheme.description}</p>
                  </div>
                </div>
              </div>

              <div className="border border-separator p-4 md:p-6 space-y-4">
                <h3 className="font-display text-2xl">Why this preset works</h3>
                <p className="text-sm text-muted-foreground">{selectedTheme.why}</p>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Gradient:</span> {selectedTheme.gradient}
                  </p>
                  <p>
                    <span className="font-semibold">Motion cadence:</span> {selectedTheme.motionSeconds}s
                  </p>
                  <p>
                    <span className="font-semibold">Tip:</span> Keep main content on top with 70–90% contrast and always support reduced motion.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Starter CSS
                  </p>
                  <pre className="max-h-[260px] overflow-auto border border-separator p-3 text-xs whitespace-pre-wrap">
                    {buildThemeSnippet(selectedTheme)}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === "terminology" && (
          <section className="border border-separator p-4 md:p-6 space-y-4">
            <h2 className="font-display text-3xl">Coding Glossary and Abbreviations</h2>
            <p className="text-sm text-muted-foreground">
              Search abbreviations, full forms, and definitions while you work.
            </p>
            <input
              value={termQuery}
              onChange={(event) => setTermQuery(event.target.value)}
              placeholder="Search terms (e.g. API, CI, JWT, SSR)..."
              className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground"
            />
            <div className="max-h-[34rem] overflow-auto border border-separator">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background border-b border-separator">
                  <tr>
                    <th className="text-left px-3 py-2">Abbreviation</th>
                    <th className="text-left px-3 py-2">Expanded</th>
                    <th className="text-left px-3 py-2">Definition</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTerms.map((term) => (
                    <tr key={term.abbr} className="border-b border-separator">
                      <td className="px-3 py-2 font-semibold">{term.abbr}</td>
                      <td className="px-3 py-2">{term.expanded}</td>
                      <td className="px-3 py-2 text-muted-foreground">{term.definition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "tutor" && (
          <section className="border border-separator p-4 md:p-6 space-y-4 max-w-4xl">
            <h2 className="font-display text-3xl">AI Tutor</h2>
            <p className="text-sm text-muted-foreground">
              Ask how/why we run commands, GitHub workflows, deployment basics, or cinematic theme design.
            </p>
            <textarea
              value={tutorQuestion}
              onChange={(event) => setTutorQuestion(event.target.value)}
              placeholder="Example: Why do we run git add before git commit? How do I make cinematic animated backgrounds?"
              className="w-full min-h-28 border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={askTutor}
                className="text-xs border border-foreground px-3 py-2"
              >
                Ask Tutor
              </button>
              <button
                type="button"
                onClick={() =>
                  setTutorQuestion(
                    "How do I create cinematic motion backgrounds and themes in a web app?",
                  )
                }
                className="text-xs border border-border px-3 py-2"
              >
                Use cinematic example
              </button>
            </div>
            <div className="border border-separator p-3 min-h-24">
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                {tutorAnswer || "Tutor responses appear here."}
              </pre>
            </div>
          </section>
        )}
      </section>
    </Layout>
  );
}
