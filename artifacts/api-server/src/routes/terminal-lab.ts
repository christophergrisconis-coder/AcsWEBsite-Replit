import { Router } from "express";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { requireAdminToken } from "../lib/admin-auth";

type ExecuteBody = {
  input?: unknown;
  cwd?: unknown;
  timeoutMs?: unknown;
};

type TutorBody = {
  question?: unknown;
};

const router = Router();
const allowedCommands = new Set([
  "git",
  "gh",
  "pnpm",
  "npm",
  "node",
  "npx",
  "tsc",
  "ls",
  "pwd",
  "cat",
  "echo",
  "mkdir",
  "touch",
  "cp",
  "mv",
  "rm",
]);

function explainCommandPurpose(command: string, args: string[]): string {
  if (command === "pwd") {
    return "Shows your current working directory so you always know where commands will apply.";
  }
  if (command === "ls") {
    return "Lists files/folders to inspect project structure before making changes.";
  }
  if (command === "cat") {
    return "Displays file contents so you can verify config or code without opening another tool.";
  }
  if (command === "mkdir") {
    return "Creates directories to structure project files in a predictable way.";
  }
  if (command === "touch") {
    return "Creates a new file placeholder so you can start adding content.";
  }
  if (command === "cp") {
    return "Copies files safely when you want a template or backup before editing.";
  }
  if (command === "mv") {
    return "Moves or renames files to keep naming and folder organization clean.";
  }
  if (command === "rm") {
    return "Removes files/directories you no longer need. In learning workflows, delete carefully to avoid data loss.";
  }
  if (command === "echo") {
    return "Prints text or values; useful for debugging shell variables and script behavior.";
  }
  if (command === "node") {
    return "Runs JavaScript tooling or scripts in a Node runtime.";
  }
  if (command === "npm" || command === "pnpm" || command === "npx") {
    return "Runs package manager tasks like install/build/test so your project dependencies and scripts stay reproducible.";
  }
  if (command === "tsc") {
    return "Runs TypeScript checks/compilation to catch type errors before runtime.";
  }
  if (command === "git") {
    const verb = args[0] ?? "";
    if (verb === "init") return "Starts version control for this folder so your changes are tracked over time.";
    if (verb === "status") return "Shows changed/untracked files so you know exactly what will be committed.";
    if (verb === "add") return "Stages selected files for the next commit snapshot.";
    if (verb === "commit")
      return "Creates an immutable snapshot with a message explaining what changed and why.";
    if (verb === "push")
      return "Uploads local commits to a remote repository so work is backed up and shareable.";
    if (verb === "pull")
      return "Brings remote changes into your local repository so your branch stays up to date.";
    return "Git tracks project history, supports safe experimentation, and makes collaboration possible.";
  }
  if (command === "gh") {
    return "GitHub CLI integrates your local git repo with GitHub (create repo, auth, PRs, issues, and pushes).";
  }
  return "Runs a project operation inside your sandbox so you can learn by doing with isolated files.";
}

function isTerminalLabEnabled(): boolean {
  return process.env.ENABLE_TERMINAL_LAB === "true";
}

function getSandboxRoot(): string {
  const rawRoot = process.env.TERMINAL_LAB_ROOT;
  if (!rawRoot) {
    throw new Error("TERMINAL_LAB_ROOT is not configured");
  }

  const resolvedRoot = path.resolve(rawRoot);
  const stats = fs.statSync(resolvedRoot, { throwIfNoEntry: false });
  if (!stats || !stats.isDirectory()) {
    throw new Error("TERMINAL_LAB_ROOT must point to an existing directory");
  }
  return resolvedRoot;
}

function isPathInside(parent: string, child: string): boolean {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function resolveWorkingDirectory(root: string, candidate?: string): string {
  if (!candidate || candidate.trim() === "") {
    return root;
  }

  const next = path.isAbsolute(candidate)
    ? path.resolve(candidate)
    : path.resolve(root, candidate);

  if (!isPathInside(root, next)) {
    throw new Error("Path escapes sandbox root");
  }

  const stats = fs.statSync(next, { throwIfNoEntry: false });
  if (!stats || !stats.isDirectory()) {
    throw new Error("Working directory does not exist");
  }
  return next;
}

function parseCommand(input: string): string[] {
  const parts: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (current) {
        parts.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (quote) {
    throw new Error("Unterminated quote in command");
  }

  if (current) {
    parts.push(current);
  }

  return parts;
}

function createTutorAnswer(questionRaw: string): string {
  const question = questionRaw.toLowerCase();

  if (question.includes("why") && question.includes("command")) {
    return "Commands exist to make system behavior explicit and repeatable. Instead of clicking around, you describe exact operations (read, compile, test, deploy) so the workflow is auditable and automatable.";
  }
  if (question.includes("github") || question.includes("git")) {
    return "Git stores your code history locally; GitHub stores a remote copy for backup and collaboration. Typical flow: git init -> git add -> git commit -> gh repo create -> git push.";
  }
  if (
    question.includes("theme") ||
    question.includes("cinematic") ||
    question.includes("motion") ||
    question.includes("background")
  ) {
    return "For cinematic themes, build three layers: 1) deep gradient/noise background, 2) moving light or particle layer (slow transform/opacity), 3) interactive foreground (parallax tied to pointer). Keep motion subtle (4s-20s durations), ease-in-out curves, and honor prefers-reduced-motion.";
  }
  if (
    question.includes("terminal") ||
    question.includes("shell") ||
    question.includes("path")
  ) {
    return "The terminal window captures your input; the shell interprets it. The shell resolves command binaries from PATH and launches them with arguments in your current working directory.";
  }
  if (question.includes("pdf")) {
    return "CLI PDF workflows convert text/markup/postscript into PDF so generation is scriptable and reproducible across environments.";
  }
  if (question.includes("zip")) {
    return "ZIP compression packages multiple files/folders into one portable artifact for sharing and backups.";
  }
  if (question.includes("learn") || question.includes("study")) {
    return "Best learning loop: inspect (pwd/ls/cat) -> change (mkdir/touch/edit) -> verify (run/typecheck/test) -> version (git status/add/commit) -> publish (push).";
  }

  return "I can help with terminal workflows, Git/GitHub, command purpose, deployment basics, and cinematic theme/motion design. Ask a focused question and I will break it down step by step.";
}

router.get("/terminal-lab/status", requireAdminToken, (_req, res) => {
  if (!isTerminalLabEnabled()) {
    res.status(403).json({
      enabled: false,
      error: "Terminal lab is disabled. Set ENABLE_TERMINAL_LAB=true.",
    });
    return;
  }

  try {
    const root = getSandboxRoot();
    res.json({
      enabled: true,
      root,
      allowedCommands: Array.from(allowedCommands),
      maxTimeoutMs: 120_000,
    });
  } catch (error) {
    res.status(500).json({
      enabled: false,
      error: error instanceof Error ? error.message : "Invalid terminal lab configuration",
    });
  }
});

router.post("/terminal-lab/execute", requireAdminToken, async (req, res) => {
  if (!isTerminalLabEnabled()) {
    res.status(403).json({
      error: "Terminal lab is disabled. Set ENABLE_TERMINAL_LAB=true.",
    });
    return;
  }

  let root: string;
  try {
    root = getSandboxRoot();
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Invalid terminal lab configuration",
    });
    return;
  }

  const body = (req.body ?? {}) as ExecuteBody;
  const rawInput = typeof body.input === "string" ? body.input.trim() : "";
  if (!rawInput) {
    res.status(400).json({ error: "Command input is required" });
    return;
  }
  if (rawInput.length > 1000) {
    res.status(400).json({ error: "Command input is too long" });
    return;
  }

  const timeoutMsRaw = typeof body.timeoutMs === "number" ? body.timeoutMs : 20_000;
  const timeoutMs = Math.max(1_000, Math.min(120_000, Math.floor(timeoutMsRaw)));

  let workingDirectory: string;
  try {
    workingDirectory = resolveWorkingDirectory(
      root,
      typeof body.cwd === "string" ? body.cwd : undefined,
    );
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Invalid working directory",
    });
    return;
  }

  let argv: string[];
  try {
    argv = parseCommand(rawInput);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Invalid command syntax",
    });
    return;
  }

  if (argv.length === 0) {
    res.status(400).json({ error: "Command input is required" });
    return;
  }

  const [command, ...args] = argv;
  if (command === "cd") {
    const target = args[0] ?? root;
    try {
      const nextCwd = resolveWorkingDirectory(root, path.isAbsolute(target) ? target : path.join(workingDirectory, target));
      res.json({
        command,
        args,
        cwd: nextCwd,
        stdout: "",
        stderr: "",
        exitCode: 0,
        durationMs: 0,
        why: explainCommandPurpose(command, args),
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Invalid cd target",
      });
    }
    return;
  }

  if (!allowedCommands.has(command)) {
    res.status(400).json({
      error: `Command "${command}" is not allowed in sandbox mode`,
      allowedCommands: Array.from(allowedCommands),
    });
    return;
  }

  const startedAt = Date.now();
  const child = spawn(command, args, {
    cwd: workingDirectory,
    env: process.env,
    shell: false,
  });

  let stdout = "";
  let stderr = "";
  let timedOut = false;
  const maxCollectedBytes = 256_000;

  const append = (current: string, chunk: Buffer): string =>
    `${current}${chunk.toString("utf8")}`.slice(-maxCollectedBytes);

  child.stdout.on("data", (chunk: Buffer) => {
    stdout = append(stdout, chunk);
  });
  child.stderr.on("data", (chunk: Buffer) => {
    stderr = append(stderr, chunk);
  });

  const timer = setTimeout(() => {
    timedOut = true;
    child.kill("SIGTERM");
  }, timeoutMs);

  child.on("error", (error) => {
    clearTimeout(timer);
    res.status(400).json({
      error: `Failed to start command: ${error.message}`,
      cwd: workingDirectory,
    });
  });

  child.on("close", (exitCode, signal) => {
    clearTimeout(timer);
    res.json({
      command,
      args,
      cwd: workingDirectory,
      stdout,
      stderr,
      exitCode: exitCode ?? (timedOut ? 124 : 1),
      signal,
      timedOut,
      durationMs: Date.now() - startedAt,
      why: explainCommandPurpose(command, args),
    });
  });
});

router.post("/terminal-lab/tutor", requireAdminToken, (req, res) => {
  if (!isTerminalLabEnabled()) {
    res.status(403).json({
      error: "Terminal lab is disabled. Set ENABLE_TERMINAL_LAB=true.",
    });
    return;
  }

  const body = (req.body ?? {}) as TutorBody;
  const question =
    typeof body.question === "string" ? body.question.trim() : "";

  if (!question) {
    res.status(400).json({ error: "Question is required" });
    return;
  }

  if (question.length > 1000) {
    res.status(400).json({ error: "Question is too long" });
    return;
  }

  res.json({
    question,
    answer: createTutorAnswer(question),
  });
});

export default router;
