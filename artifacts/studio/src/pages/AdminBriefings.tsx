import { useCallback, useEffect, useState } from "react";
import { usePageMetadata } from "@/hooks/use-page-metadata";

type ReviewStatus = "new" | "reviewed" | "archived";

interface BriefingRequest {
  id: string;
  agencyName: string;
  programInterest: string;
  contactName: string;
  contactEmail: string;
  message: string | null;
  notificationStatus: string;
  notificationError: string | null;
  notifiedAt: string | null;
  status: ReviewStatus;
  createdAt: string;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1 block">
        {label}
      </span>
      <input
        type={type}
        className="w-full bg-transparent border border-separator px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const AdminBriefings = () => {
  usePageMetadata("Admin — Briefings", "Review agency briefing requests");

  const [tokenInput, setTokenInput] = useState("");
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "all">("new");
  const [requests, setRequests] = useState<BriefingRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [actionError, setActionError] = useState("");

  const loadRequests = useCallback(
    async (token: string, filter: ReviewStatus | "all") => {
      setLoading(true);
      setListError("");
      try {
        const query = filter === "all" ? "" : `?status=${filter}`;
        const res = await fetch(`/api/briefing-requests${query}`, {
          headers: { "x-admin-token": token },
        });
        if (res.status === 401) {
          setActiveToken(null);
          setAuthError("Incorrect admin token.");
          return;
        }
        if (!res.ok) {
          setListError("Could not load briefing requests.");
          return;
        }
        const data = (await res.json()) as { requests: BriefingRequest[] };
        setRequests(data.requests);
      } catch {
        setListError("Could not load briefing requests.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleUnlock = async () => {
    setAuthError("");
    const res = await fetch("/api/briefing-requests?status=new", {
      headers: { "x-admin-token": tokenInput },
    });
    if (res.status === 401) {
      setAuthError("Incorrect admin token.");
      return;
    }
    if (!res.ok) {
      setAuthError("Could not verify admin token.");
      return;
    }
    setActiveToken(tokenInput);
    const data = (await res.json()) as { requests: BriefingRequest[] };
    setRequests(data.requests);
    setStatusFilter("new");
  };

  useEffect(() => {
    if (!activeToken) return;
    void loadRequests(activeToken, statusFilter);
  }, [activeToken, statusFilter, loadRequests]);

  const updateStatus = async (id: string, status: ReviewStatus) => {
    if (!activeToken) return;
    setActionError("");
    const res = await fetch(`/api/briefing-requests/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": activeToken,
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setActionError("Failed to update request status.");
      return;
    }
    await loadRequests(activeToken, statusFilter);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container-wide py-16 md:py-24 max-w-5xl">
        <p className="text-label mb-4">Admin</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Briefing inbox
        </h1>
        <p className="text-muted-foreground mb-12 max-w-2xl leading-relaxed">
          Review agency briefing requests captured from the public site. Mark
          items reviewed or archived after follow-up.
        </p>

        {!activeToken ? (
          <div className="max-w-sm space-y-4">
            <Field
              label="Admin token"
              value={tokenInput}
              onChange={setTokenInput}
              type="password"
            />
            {authError ? <p className="text-xs text-red-400">{authError}</p> : null}
            <button
              type="button"
              onClick={handleUnlock}
              className="text-sm border border-foreground px-5 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              Unlock
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              {(["new", "reviewed", "archived", "all"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatusFilter(value)}
                  className={`text-xs uppercase tracking-widest px-3 py-2 border transition-colors ${
                    statusFilter === value
                      ? "border-foreground bg-foreground text-background"
                      : "border-separator text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {value}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setActiveToken(null)}
                className="ml-auto text-xs text-muted-foreground underline underline-offset-2"
              >
                Lock
              </button>
            </div>

            {actionError ? <p className="text-xs text-red-400">{actionError}</p> : null}
            {listError ? <p className="text-xs text-red-400">{listError}</p> : null}
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : null}

            {!loading && requests.length === 0 ? (
              <p className="text-sm text-muted-foreground border border-separator p-6">
                No briefing requests in this view.
              </p>
            ) : null}

            <div className="space-y-4">
              {requests.map((request) => (
                <article
                  key={request.id}
                  className="border border-separator p-5 md:p-6 space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-accent mb-2">
                        {request.status}
                      </p>
                      <h2 className="font-display text-2xl font-bold tracking-tight">
                        {request.agencyName}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {request.contactName} ·{" "}
                        <a
                          href={`mailto:${request.contactEmail}`}
                          className="underline underline-offset-2 hover:text-foreground"
                        >
                          {request.contactEmail}
                        </a>
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground shrink-0">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>

                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                        Program interest
                      </dt>
                      <dd>{request.programInterest}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                        Notification
                      </dt>
                      <dd>{request.notificationStatus}</dd>
                    </div>
                  </dl>

                  {request.message ? (
                    <p className="text-sm leading-relaxed text-muted-foreground border-t border-separator pt-4">
                      {request.message}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-3 pt-2">
                    {request.status !== "reviewed" ? (
                      <button
                        type="button"
                        onClick={() => updateStatus(request.id, "reviewed")}
                        className="text-xs uppercase tracking-widest border border-foreground px-3 py-2 hover:bg-foreground hover:text-background transition-colors"
                      >
                        Mark reviewed
                      </button>
                    ) : null}
                    {request.status !== "archived" ? (
                      <button
                        type="button"
                        onClick={() => updateStatus(request.id, "archived")}
                        className="text-xs uppercase tracking-widest border border-separator px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Archive
                      </button>
                    ) : null}
                    {request.status !== "new" ? (
                      <button
                        type="button"
                        onClick={() => updateStatus(request.id, "new")}
                        className="text-xs uppercase tracking-widest text-muted-foreground underline underline-offset-2"
                      >
                        Restore to new
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBriefings;
