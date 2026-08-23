import { useState } from "react";
import { useOutcomes, useUpdateProgram, useUpdateAggregate, type ApiMetric, type ApiAggregateStat } from "@/hooks/use-outcomes";
import { usePageMetadata } from "@/hooks/use-page-metadata";

// ---------------------------------------------------------------------------
// Tiny helper components
// ---------------------------------------------------------------------------

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const base =
    "w-full bg-transparent border border-separator px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors";
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1 block">
        {label}
      </span>
      {multiline ? (
        <textarea
          className={`${base} min-h-[80px] resize-y`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className={base}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function StatusMessage({
  error,
  success,
}: {
  error?: string;
  success?: boolean;
}) {
  if (success)
    return (
      <p className="text-xs text-green-500 mt-2">Saved successfully.</p>
    );
  if (error) return <p className="text-xs text-red-400 mt-2">{error}</p>;
  return null;
}

// ---------------------------------------------------------------------------
// Per-metric editor
// ---------------------------------------------------------------------------

function MetricEditor({
  metric,
  index,
  onChange,
}: {
  metric: ApiMetric;
  index: number;
  onChange: (m: ApiMetric) => void;
}) {
  return (
    <div className="border border-separator p-4 space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        Metric {index + 1}
      </p>
      <Field
        label="Value"
        value={metric.value}
        onChange={(v) => onChange({ ...metric, value: v })}
      />
      <Field
        label="Label"
        value={metric.label}
        onChange={(v) => onChange({ ...metric, label: v })}
      />
      <Field
        label="Note (optional)"
        value={metric.note ?? ""}
        onChange={(v) => onChange({ ...metric, note: v || undefined })}
      />
      {metric.baseline && (
        <>
          <Field
            label="Baseline value"
            value={metric.baseline.value}
            onChange={(v) =>
              onChange({ ...metric, baseline: { ...metric.baseline!, value: v } })
            }
          />
          <Field
            label="Baseline source"
            value={metric.baseline.source}
            onChange={(v) =>
              onChange({ ...metric, baseline: { ...metric.baseline!, source: v } })
            }
          />
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Program card editor
// ---------------------------------------------------------------------------

function ProgramEditor({ programId, token }: { programId: string; token: string }) {
  const { data } = useOutcomes();
  const updateProgram = useUpdateProgram();

  const program = data?.programs.find((p) => p.programId === programId);
  const [metrics, setMetrics] = useState<ApiMetric[] | null>(null);
  const [saveState, setSaveState] = useState<{ ok?: boolean; err?: string }>({});

  if (!program) return null;

  // Use local edits if available, else live data
  const activeMetrics = metrics ?? program.metrics;

  const handleMetricChange = (i: number, m: ApiMetric) => {
    const next = activeMetrics.map((x, idx) => (idx === i ? m : x));
    setMetrics(next);
    setSaveState({});
  };

  const handleSave = async () => {
    setSaveState({});
    try {
      await updateProgram.mutateAsync({
        programId,
        token,
        data: { metrics: activeMetrics },
      });
      setSaveState({ ok: true });
    } catch (e) {
      setSaveState({ err: (e as Error).message });
    }
  };

  return (
    <div className="border border-separator p-6 space-y-4">
      <h3 className="font-display text-xl font-bold">{program.programTitle}</h3>
      <p className="text-xs text-muted-foreground">{program.tagline}</p>

      <div className="space-y-3">
        {activeMetrics.map((m, i) => (
          <MetricEditor
            key={i}
            metric={m}
            index={i}
            onChange={(updated) => handleMetricChange(i, updated)}
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={updateProgram.isPending}
          className="text-sm border border-foreground px-5 py-2 hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
        >
          {updateProgram.isPending ? "Saving…" : "Save metrics"}
        </button>
        <StatusMessage error={saveState.err} success={saveState.ok} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Aggregate impact editor
// ---------------------------------------------------------------------------

function AggregateEditor({ token }: { token: string }) {
  const { data } = useOutcomes();
  const updateAggregate = useUpdateAggregate();

  const live = data?.aggregateImpact;
  const [stats, setStats] = useState<ApiAggregateStat[] | null>(null);
  const [saveState, setSaveState] = useState<{ ok?: boolean; err?: string }>({});

  if (!live) return null;

  const activeStats = stats ?? live.stats;

  const handleStatChange = (i: number, field: keyof ApiAggregateStat, v: string) => {
    const next = activeStats.map((s, idx) => (idx === i ? { ...s, [field]: v } : s));
    setStats(next);
    setSaveState({});
  };

  const handleSave = async () => {
    setSaveState({});
    try {
      await updateAggregate.mutateAsync({ token, data: { stats: activeStats } });
      setSaveState({ ok: true });
    } catch (e) {
      setSaveState({ err: (e as Error).message });
    }
  };

  return (
    <div className="border border-separator p-6 space-y-4">
      <h3 className="font-display text-xl font-bold">Aggregate impact strip</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activeStats.map((stat, i) => (
          <div key={i} className="border border-separator p-4 space-y-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Stat {i + 1}
            </p>
            <Field
              label="Value"
              value={stat.value}
              onChange={(v) => handleStatChange(i, "value", v)}
            />
            <Field
              label="Label"
              value={stat.label}
              onChange={(v) => handleStatChange(i, "label", v)}
            />
            <Field
              label="Context"
              value={stat.context}
              onChange={(v) => handleStatChange(i, "context", v)}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={updateAggregate.isPending}
          className="text-sm border border-foreground px-5 py-2 hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
        >
          {updateAggregate.isPending ? "Saving…" : "Save aggregate stats"}
        </button>
        <StatusMessage error={saveState.err} success={saveState.ok} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const AdminOutcomes = () => {
  usePageMetadata("Admin — Outcomes", "Update outcome figures");

  const [tokenInput, setTokenInput] = useState("");
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState("");

  const { data } = useOutcomes();

  const handleUnlock = async () => {
    setAuthError("");
    // Verify the token against the API by sending a benign PUT with it
    const res = await fetch("/api/outcomes/aggregate", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": tokenInput,
      },
      // Empty body — nothing changes, but we get a 401 if the token is wrong
      body: JSON.stringify({}),
    });

    if (res.status === 401) {
      setAuthError("Incorrect admin token.");
    } else {
      setActiveToken(tokenInput);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container-wide py-16 md:py-24 max-w-4xl">
        <p className="text-label mb-4">Admin</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-12">
          Outcomes editor
        </h1>

        {!activeToken ? (
          /* ── Auth gate ── */
          <div className="max-w-sm space-y-4">
            <Field
              label="Admin token"
              value={tokenInput}
              onChange={setTokenInput}
            />
            {authError && (
              <p className="text-xs text-red-400">{authError}</p>
            )}
            <button
              type="button"
              onClick={handleUnlock}
              className="text-sm border border-foreground px-5 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              Unlock
            </button>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Enter the admin token to edit outcome figures. Changes are saved
              to the database and reflected on the Outcomes page immediately.
            </p>
          </div>
        ) : (
          /* ── Editors ── */
          <div className="space-y-8">
            <AggregateEditor token={activeToken} />

            {data?.programs.map((p) => (
              <ProgramEditor key={p.programId} programId={p.programId} token={activeToken} />
            ))}

            <button
              type="button"
              onClick={() => setActiveToken(null)}
              className="text-xs text-muted-foreground underline underline-offset-2"
            >
              Lock
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOutcomes;
