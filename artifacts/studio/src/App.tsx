import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { Toaster } from '@workspace/organic/components/ui/toaster';
import { TooltipProvider } from '@workspace/organic/components/ui/tooltip';
import { ErrorBoundary } from '@/components/error-boundary';
import Home from '@/pages/Home';
import Work from '@/pages/Work';
import WorkDetail from '@/pages/WorkDetail';
import Outcomes from '@/pages/Outcomes';
import OutcomesPrint from '@/pages/OutcomesPrint';
import AdminOutcomes from '@/pages/AdminOutcomes';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/work" component={Work} />
        <Route path="/work/:id" component={WorkDetail} />
        <Route path="/outcomes" component={Outcomes} />
        <Route path="/outcomes/print" component={OutcomesPrint} />
        <Route path="/admin/outcomes" component={AdminOutcomes} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
