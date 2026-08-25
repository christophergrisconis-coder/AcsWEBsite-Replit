import { useEffect, useRef, useState } from "react";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useSubmitBriefingRequest } from "@workspace/api-client-react";
import { programOutcomes } from "@/data/outcomes";

interface BriefingModalProps {
  open: boolean;
  onClose: () => void;
  /** Pre-select a program when opening from a specific program panel */
  defaultProgram?: string;
}

const PROGRAM_OPTIONS = [
  { value: "general", label: "General inquiry" },
  ...programOutcomes.map((p) => ({
    value: p.programId,
    label: p.programTitle,
  })),
];

const inputBase =
  "w-full bg-transparent border-b border-separator py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors";

const labelBase = "block text-label mb-2";

export function BriefingModal({ open, onClose, defaultProgram }: BriefingModalProps) {
  const [form, setForm] = useState({
    agencyName: "",
    programInterest: defaultProgram ?? "general",
    contactName: "",
    contactEmail: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { mutate, isPending, isSuccess, isError, error, reset } =
    useSubmitBriefingRequest();

  useEffect(() => {
    if (!open) return;
    setForm({
      agencyName: "",
      programInterest: defaultProgram ?? "general",
      contactName: "",
      contactEmail: "",
      message: "",
    });
    setFieldErrors({});
    reset();
  }, [open, defaultProgram, reset]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setFieldErrors((fe) => ({ ...fe, [key]: "" }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.agencyName.trim()) errors.agencyName = "Required";
    if (!form.contactName.trim()) errors.contactName = "Required";
    if (!form.contactEmail.trim()) {
      errors.contactEmail = "Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      errors.contactEmail = "Enter a valid email address";
    }
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    mutate({
      data: {
        agencyName: form.agencyName.trim(),
        programInterest: form.programInterest,
        contactName: form.contactName.trim(),
        contactEmail: form.contactEmail.trim(),
        message: form.message.trim() || undefined,
      },
    });
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-background/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Panel — slides in from the right edge */}
      <div
        ref={panelRef}
        className="relative h-full w-full max-w-xl bg-background border-l border-separator flex flex-col animate-slide-in-right overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="briefing-modal-title"
        aria-describedby="briefing-modal-description"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-separator shrink-0">
          <div>
            <p id="briefing-modal-title" className="text-label mb-1">Agency briefing request</p>
            <p id="briefing-modal-description" className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Tell us about your agency and program interest. Our team will
              follow up with a tailored briefing.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-4 focus-visible-ring"
            aria-label="Close briefing request"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success state */}
        {isSuccess ? (
          <div className="flex-1 flex flex-col items-start justify-center px-8 py-12 gap-6">
            <CheckCircle size={40} className="text-accent" />
            <div>
              <p className="font-display text-2xl font-bold mb-3">
                Request received.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Thank you — a member of the Advanced Creation Studio team will
                reach out to schedule your program briefing shortly.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-4 text-sm uppercase tracking-widest hover-highlight"
            >
              Close
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-8 py-8 gap-8" noValidate>
            {/* Agency */}
            <div>
              <label htmlFor="bf-agency" className={labelBase}>
                Agency or organization <span className="text-accent">*</span>
              </label>
              <input
                id="bf-agency"
                type="text"
                autoComplete="organization"
                placeholder="e.g. State Dept. of Corrections"
                value={form.agencyName}
                onChange={set("agencyName")}
                className={inputBase}
                maxLength={200}
                disabled={isPending}
              />
              {fieldErrors.agencyName && (
                <p id="bf-agency-error" className="mt-1 text-xs text-destructive" role="alert">{fieldErrors.agencyName}</p>
              )}
            </div>

            {/* Program interest */}
            <div>
              <label htmlFor="bf-program" className={labelBase}>
                Program interest
              </label>
              <select
                id="bf-program"
                value={form.programInterest}
                onChange={set("programInterest")}
                className={`${inputBase} cursor-pointer`}
                disabled={isPending}
              >
                {PROGRAM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-background">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact name */}
            <div>
              <label htmlFor="bf-name" className={labelBase}>
                Your name <span className="text-accent">*</span>
              </label>
              <input
                id="bf-name"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                value={form.contactName}
                onChange={set("contactName")}
                className={inputBase}
                maxLength={200}
                disabled={isPending}
              />
              {fieldErrors.contactName && (
                <p id="bf-name-error" className="mt-1 text-xs text-destructive" role="alert">{fieldErrors.contactName}</p>
              )}
            </div>

            {/* Contact email */}
            <div>
              <label htmlFor="bf-email" className={labelBase}>
                Work email <span className="text-accent">*</span>
              </label>
              <input
                id="bf-email"
                type="email"
                autoComplete="email"
                placeholder="you@agency.gov"
                value={form.contactEmail}
                onChange={set("contactEmail")}
                className={inputBase}
                disabled={isPending}
              />
              {fieldErrors.contactEmail && (
                <p id="bf-email-error" className="mt-1 text-xs text-destructive" role="alert">{fieldErrors.contactEmail}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="bf-message" className={labelBase}>
                Question or context
              </label>
              <textarea
                id="bf-message"
                placeholder="What are you trying to evaluate or accomplish?"
                value={form.message}
                onChange={set("message")}
                rows={4}
                className={`${inputBase} resize-none`}
                maxLength={2000}
                disabled={isPending}
              />
              <p className="mt-1 text-xs text-muted-foreground text-right">
                {form.message.length} / 2000
              </p>
            </div>

            {/* API error */}
            {isError && (
              <div className="flex items-start gap-3 border border-destructive/40 p-4 text-sm text-destructive" role="alert">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>
                  {(error as Error)?.message ?? "Something went wrong. Please try again."}
                </span>
              </div>
            )}

            {/* Submit */}
            <div className="mt-auto pt-4 border-t border-separator">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-3 bg-foreground text-background py-4 text-sm uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Request a briefing"
                )}
              </button>
              <p className="mt-3 text-xs text-muted-foreground text-center">
                Required fields marked <span className="text-accent">*</span>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
