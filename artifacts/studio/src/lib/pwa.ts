const DISMISS_KEY = "acs-pwa-install-dismissed-until";

export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  // Avoid fighting Vite HMR in local development.
  if (import.meta.env.DEV) {
    return;
  }

  const register = () => {
    const swUrl = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/sw.js`;
    navigator.serviceWorker.register(swUrl).catch((error) => {
      console.error("Service worker registration failed", error);
    });
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register, { once: true });
  }
}

export function wasInstallPromptDismissed() {
  try {
    const until = Number(localStorage.getItem(DISMISS_KEY) ?? "0");
    return Number.isFinite(until) && until > Date.now();
  } catch {
    return false;
  }
}

export function dismissInstallPrompt(days = 21) {
  try {
    const until = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, String(until));
  } catch {
    // ignore storage failures
  }
}
