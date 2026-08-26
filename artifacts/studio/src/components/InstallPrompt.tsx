import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { dismissInstallPrompt, wasInstallPromptDismissed } from "@/lib/pwa";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (wasInstallPromptDismissed()) return;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  if (!visible || !deferred) return null;

  const close = () => {
    dismissInstallPrompt();
    setVisible(false);
    setDeferred(null);
  };

  const install = async () => {
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "dismissed") {
      dismissInstallPrompt(7);
    } else {
      dismissInstallPrompt(90);
    }
    setVisible(false);
    setDeferred(null);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 md:p-6 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-xl border border-separator bg-background/95 backdrop-blur-sm p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-[0_-8px_40px_rgba(0,0,0,0.35)]">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="shrink-0 mt-0.5">
            <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" fill="#050505" />
              <rect x="7" y="6" width="5" height="20" fill="#E5FF00" />
              <rect x="20" y="6" width="5" height="20" fill="#E5FF00" />
              <rect x="7" y="24" width="18" height="3" fill="#E5FF00" />
              <polygon points="13,24 23,8 25,8 15,24" fill="#F7F7F4" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-label text-accent mb-1">Install ACS</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Keep partner resources and outcomes one tap away — add Advanced
              Creation Studio to your home screen.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={install}
            className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity focus-visible-ring"
          >
            <Download size={14} />
            Install
          </button>
          <button
            type="button"
            onClick={close}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors focus-visible-ring"
            aria-label="Dismiss install prompt"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
