import { Link } from "wouter";
import { usePageMetadata } from "@/hooks/use-page-metadata";

const NotFound = () => {
  usePageMetadata("Page Not Found", "The requested page could not be found.");
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="font-display text-8xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground">Page not found</p>
        <Link
          href="/"
          className="inline-block text-sm uppercase tracking-widest hover-highlight"
        >
          ← Return home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
