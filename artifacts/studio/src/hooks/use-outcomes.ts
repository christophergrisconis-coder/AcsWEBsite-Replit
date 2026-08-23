import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { programOutcomes, aggregateImpact } from "@/data/outcomes";
import type { ProgramOutcome } from "@/data/outcomes";

// ---------------------------------------------------------------------------
// API shapes
// ---------------------------------------------------------------------------

export interface ApiMetric {
  value: string;
  label: string;
  note?: string;
  baseline?: { value: string; source: string };
}

export interface ApiCohortContext {
  label: string;
  value: string;
}

export interface ApiOutcomeDefinition {
  term: string;
  definition: string;
}

export interface ApiAggregateStat {
  value: string;
  label: string;
  context: string;
}

export interface ApiProgramOutcome {
  programId: string;
  programTitle: string;
  tagline: string;
  measurementPeriod: string;
  cohortContext: ApiCohortContext[];
  metrics: ApiMetric[];
  definitions: ApiOutcomeDefinition[];
  updatedAt?: string;
}

export interface ApiAggregateImpact {
  headline: string;
  note: string;
  stats: ApiAggregateStat[];
  updatedAt?: string;
}

export interface OutcomesApiResponse {
  programs: ApiProgramOutcome[];
  aggregateImpact: ApiAggregateImpact | null;
}

// ---------------------------------------------------------------------------
// Static fallback (mirrors hardcoded values so the page always renders)
// ---------------------------------------------------------------------------

const staticFallback: OutcomesApiResponse = {
  programs: programOutcomes as ApiProgramOutcome[],
  aggregateImpact: {
    headline: aggregateImpact.headline,
    note: aggregateImpact.note,
    stats: aggregateImpact.stats,
  },
};

// ---------------------------------------------------------------------------
// Fetch helper
// ---------------------------------------------------------------------------

async function fetchOutcomes(): Promise<OutcomesApiResponse> {
  const res = await fetch("/api/outcomes");
  if (!res.ok) throw new Error(`Failed to fetch outcomes: ${res.status}`);
  return res.json() as Promise<OutcomesApiResponse>;
}

// ---------------------------------------------------------------------------
// Public hook — read outcomes (with static fallback on error or empty data)
// ---------------------------------------------------------------------------

async function fetchOutcomesWithFallback(): Promise<OutcomesApiResponse> {
  let data: OutcomesApiResponse;
  try {
    data = await fetchOutcomes();
  } catch {
    // Network error or non-2xx response — serve static fallback so the print
    // page always renders and auto-print fires even when the API is down.
    return staticFallback;
  }
  // If the API returned successfully but has no programs (e.g. fresh unseeded
  // DB), transparently return the static fallback so the page always renders.
  if (!data.programs || data.programs.length === 0) {
    return staticFallback;
  }
  // Ensure aggregate is always present
  if (!data.aggregateImpact) {
    return { ...data, aggregateImpact: staticFallback.aggregateImpact };
  }
  return data;
}

export function useOutcomes() {
  return useQuery<OutcomesApiResponse>({
    queryKey: ["outcomes"],
    queryFn: fetchOutcomesWithFallback,
    // Stale after 5 minutes; serve cached data while revalidating
    staleTime: 5 * 60 * 1000,
    // On network/server error, fall back to static data so the page never breaks
    placeholderData: staticFallback,
    retry: 1,
  });
}

// ---------------------------------------------------------------------------
// Admin mutations
// ---------------------------------------------------------------------------

export function useUpdateProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      programId,
      token,
      data,
    }: {
      programId: string;
      token: string;
      data: Partial<Omit<ApiProgramOutcome, "programId" | "updatedAt">>;
    }) => {
      const res = await fetch(`/api/outcomes/programs/${encodeURIComponent(programId)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["outcomes"] }),
  });
}

export function useUpdateAggregate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      token,
      data,
    }: {
      token: string;
      data: Partial<Omit<ApiAggregateImpact, "updatedAt">>;
    }) => {
      const res = await fetch("/api/outcomes/aggregate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["outcomes"] }),
  });
}

// ---------------------------------------------------------------------------
// Helper — cast a ProgramOutcome from static file to ApiProgramOutcome
// ---------------------------------------------------------------------------

export function toProgramOutcome(p: ProgramOutcome): ApiProgramOutcome {
  return p as unknown as ApiProgramOutcome;
}
