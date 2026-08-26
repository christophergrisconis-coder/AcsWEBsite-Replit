import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { BriefingModal } from "@/components/BriefingModal";

const navItems = [
  { label: "Impact", path: "/work" },
  { label: "Outcomes", path: "/outcomes" },
  { label: "Partners", path: "/partners" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

interface HeaderProps {
  revealMode?: boolean;
}

export function Header({ revealMode = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(!revealMode);
  const [mounted, setMounted] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !mobileMenuRef.current) return;

      const focusable = Array.from(
        mobileMenuRef.current.querySelectorAll<HTMLElement>(
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
    const firstLink = mobileMenuRef.current?.querySelector<HTMLElement>("a");
    firstLink?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!revealMode) {
      setIsVisible(true);
      return;
    }
    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(e.clientY < 100);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [revealMode]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <div className="container-wide relative">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 font-display text-lg font-semibold tracking-tight text-foreground hover:opacity-70 transition-opacity"
            aria-label="Advanced Creation Studio home"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              className="shrink-0"
              aria-hidden="true"
            >
              <rect width="32" height="32" fill="#050505" />
              <rect x="7" y="6" width="5" height="20" fill="#E5FF00" />
              <rect x="20" y="6" width="5" height="20" fill="#E5FF00" />
              <rect x="7" y="24" width="18" height="3" fill="#E5FF00" />
              <polygon points="13,24 23,8 25,8 15,24" fill="#F7F7F4" />
            </svg>
            <span>Advanced Creation</span>
          </Link>

          {/* Desktop Navigation — Centered */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-xs font-sans tracking-widest uppercase transition-all duration-300 hover:tracking-[0.2em] ${
                  location === item.path ||
                  (item.path === "/work" && location.startsWith("/work/"))
                    ? "text-foreground"
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setBriefingOpen(true)}
              className="text-xs font-sans tracking-widest uppercase text-accent hover:text-foreground transition-all duration-300 hover:tracking-[0.2em] focus-visible-ring"
            >
              Briefing
            </button>
          </nav>

          {/* Right — Theme Toggle */}
          <div className="hidden md:flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 text-foreground/60 hover:text-foreground transition-colors focus-visible-ring"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to light theme"}
              title={theme === "dark" ? "Switch to light theme" : "Switch to light theme"}
            >
              {mounted && (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
            </button>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-foreground/60 hover:text-foreground transition-colors focus-visible-ring"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to light theme"}
              title={theme === "dark" ? "Switch to light theme" : "Switch to light theme"}
            >
              {mounted && (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
            </button>
            <button
              ref={menuButtonRef}
              className="p-2 -mr-2 text-foreground"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-navigation"
          className="md:hidden fixed left-0 right-0 top-20 bottom-0 min-h-[calc(100dvh-5rem)] bg-background z-40"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="container-wide py-12 flex flex-col gap-8" aria-label="Mobile primary navigation">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-4xl font-display text-foreground focus-visible-ring"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setBriefingOpen(true)}
              className="text-4xl font-display text-accent text-left focus-visible-ring"
            >
              Briefing
            </button>
          </nav>
        </div>
      )}
      <BriefingModal
        open={briefingOpen}
        onClose={() => setBriefingOpen(false)}
        defaultProgram="general"
      />
    </header>
  );
}
