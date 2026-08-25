import { useState } from "react";
import { Check, LockKeyhole, ShieldAlert } from "lucide-react";
import { verifiedPartnerProofs, type PartnerProof } from "@/data/projects";
import { usePageMetadata } from "@/hooks/use-page-metadata";

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1 block">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent border border-separator px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
      />
    </label>
  );
}

function ApprovalStatus({
  label,
  approved,
}: {
  label: string;
  approved: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border border-separator px-4 py-3">
      <span className="text-sm">{label}</span>
      <span
        className={`inline-flex items-center gap-2 text-xs uppercase tracking-widest ${
          approved ? "text-green-500" : "text-amber-500"
        }`}
      >
        {approved ? <Check size={14} /> : <ShieldAlert size={14} />}
        {approved ? "Approved" : "Pending"}
      </span>
    </div>
  );
}

function ProofCard({ proof }: { proof: PartnerProof }) {
  const readyToPublish = proof.sourceApproved && proof.publicationApproved;

  return (
    <article className="border border-separator p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-label text-accent mb-2">{proof.kind}</p>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            {proof.title}
          </h2>
        </div>
        <span
          className={`text-xs uppercase tracking-widest border px-3 py-2 ${
            readyToPublish
              ? "border-green-500/50 text-green-500"
              : "border-amber-500/50 text-amber-500"
          }`}
        >
          {readyToPublish ? "Ready to publish" : "Hold from public"}
        </span>
      </div>

      {proof.quote ? (
        <blockquote className="font-display text-xl leading-snug">
          “{proof.quote}”
        </blockquote>
      ) : null}
      {proof.organization ? (
        <p className="text-label">{proof.organization}</p>
      ) : null}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {proof.context}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border border-separator p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Source context
          </p>
          <p className="text-sm leading-relaxed">{proof.sourceContext}</p>
        </div>
        <div className="border border-separator p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Approval notes
          </p>
          <p className="text-sm leading-relaxed">{proof.approvalNote}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ApprovalStatus label="Source approved" approved={proof.sourceApproved} />
        <ApprovalStatus
          label="Publication permission"
          approved={proof.publicationApproved}
        />
      </div>
    </article>
  );
}

const AdminPartnerProofs = () => {
  usePageMetadata("Admin — Partner proof", "Review partner proof approvals");

  const [tokenInput, setTokenInput] = useState("");
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState("");

  const handleUnlock = async () => {
    setAuthError("");
    const response = await fetch("/api/outcomes/aggregate", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": tokenInput,
      },
      body: JSON.stringify({}),
    });

    if (response.status === 401) {
      setAuthError("Incorrect admin token.");
      return;
    }
    if (!response.ok) {
      setAuthError("Unable to verify staff access. Try again.");
      return;
    }
    setActiveToken(tokenInput);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container-wide py-16 md:py-24 max-w-5xl">
        {!activeToken ? (
          <div className="max-w-sm space-y-5">
            <p className="text-label mb-4">Staff review</p>
            <div className="flex items-start gap-3 border border-separator p-4">
              <LockKeyhole size={18} className="mt-0.5 shrink-0 text-accent" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                This review surface is limited to authorized ACS staff.
              </p>
            </div>
            <Field
              label="Admin token"
              value={tokenInput}
              onChange={setTokenInput}
            />
            {authError ? <p className="text-xs text-red-400">{authError}</p> : null}
            <button
              type="button"
              onClick={handleUnlock}
              className="text-sm border border-foreground px-5 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              Unlock review
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            <header>
              <p className="text-label mb-4">Staff review</p>
              <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
                Partner proof approvals
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mt-5">
                Confirm the source context and approval notes before allowing a
                partner story, mark, or case study to appear publicly. Both
                approvals are required by the partner hub.
              </p>
            </header>

            {verifiedPartnerProofs.length > 0 ? (
              <div className="space-y-6">
                {verifiedPartnerProofs.map((proof) => (
                  <ProofCard key={proof.id} proof={proof} />
                ))}
              </div>
            ) : (
              <div className="border border-separator p-7 md:p-10">
                <p className="text-label text-accent mb-4">No proof records</p>
                <h2 className="font-display text-3xl font-bold tracking-tight mb-4">
                  Nothing is waiting for review.
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  Partner proof is maintained in the source data. Add a record
                  only when its source context and approval note are ready for
                  staff review.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveToken(null)}
              className="text-xs text-muted-foreground underline underline-offset-2"
            >
              Lock review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPartnerProofs;