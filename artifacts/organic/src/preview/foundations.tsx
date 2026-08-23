import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Guidelines } from './parts';

const CORE_SWATCHES = [
  { name: 'Primary', className: 'bg-primary', label: 'Electric Yellow' },
  { name: 'Secondary', className: 'bg-secondary border', label: 'Neutral' },
  { name: 'Accent', className: 'bg-accent', label: 'Lime' },
] as const;

const SUPPORTING_SWATCHES = [
  { name: 'Background', className: 'border bg-background', label: 'Surface' },
  { name: 'Foreground', className: 'bg-foreground', label: 'Text' },
  { name: 'Muted', className: 'bg-muted', label: 'Subtle' },
  { name: 'Destructive', className: 'bg-destructive', label: 'Danger' },
  { name: 'Border', className: 'bg-border', label: 'Divide' },
] as const;

const TYPE_SCALE = [
  { label: 'Display', className: 'text-5xl font-bold font-serif tracking-tight', sample: 'Display Heading' },
  { label: 'Heading', className: 'text-3xl font-bold font-serif tracking-tight', sample: 'Section Heading' },
  { label: 'Subheading', className: 'text-xl font-semibold font-serif', sample: 'Subheading' },
  { label: 'Body', className: 'text-base font-sans', sample: 'Body text for reading and interface.' },
  { label: 'Label', className: 'text-xs uppercase tracking-widest text-muted-foreground font-sans', sample: 'UI LABEL' },
  { label: 'Caption', className: 'text-sm text-muted-foreground font-sans', sample: 'Caption and helper text.' },
] as const;

const SPACING_SCALE = [
  { label: '4', className: 'w-4' },
  { label: '8', className: 'w-8' },
  { label: '12', className: 'w-12' },
  { label: '16', className: 'w-16' },
  { label: '24', className: 'w-24' },
] as const;

function Swatch({
  name,
  className,
  label,
}: {
  name: string;
  className: string;
  label?: string;
}) {
  return (
    <div className="space-y-2">
      <div className={`h-16 ${className}`} />
      <p className="text-sm font-medium">{name}</p>
      {label && <p className="text-xs text-muted-foreground uppercase tracking-widest">{label}</p>}
    </div>
  );
}

export function OverviewPage() {
  return (
    <div className="space-y-4">
      {/* Design principles card */}
      <section className="border bg-primary p-5 text-primary-foreground">
        <p className="text-xs uppercase tracking-widest mb-3 opacity-60">Design language</p>
        <h2 className="text-3xl font-bold font-serif tracking-tight mb-3">
          Sharp. Bold. Deliberate.
        </h2>
        <p className="text-sm opacity-80 max-w-xl">
          Zero radius, high contrast, electric yellow on black. Every surface is intentional — 
          Syne's geometric weight for headings, Inter's clarity for interface text.
        </p>
        <Guidelines
          items={[
            { kind: 'do', text: 'Use electric yellow as a focused accent — for CTAs, active states, and key labels.' },
            { kind: 'do', text: 'Lean on Syne\'s weight for headings. Let Inter carry all body copy and UI text.' },
            { kind: 'do', text: 'Keep corners sharp — zero radius is the signature. Avoid rounding individual elements.' },
            { kind: 'dont', text: 'Overuse primary yellow as a fill — it commands attention and loses meaning if everywhere.' },
            { kind: 'dont', text: 'Mix type weights arbitrarily — Syne for structure, Inter for clarity.' },
          ]}
        />
      </section>

      <section className="rounded-none border bg-card p-5 text-card-foreground">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Core palette
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {CORE_SWATCHES.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="border bg-card p-5 text-card-foreground">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Typography
          </h2>
          <div className="mt-4 space-y-3">
            {TYPE_SCALE.slice(0, 4).map((entry) => (
              <p key={entry.label} className={entry.className}>
                {entry.sample}
              </p>
            ))}
          </div>
        </section>

        <section className="border bg-card p-5 text-card-foreground">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            In use
          </h2>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>
                Components composed from the token layer above.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="overview-name">Project name</Label>
                <Input id="overview-name" placeholder="Enter a name" />
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked id="overview-notify" />
                <Label htmlFor="overview-notify">Email notifications</Label>
                <Badge className="ml-auto">New</Badge>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button>Save</Button>
              <Button variant="outline">Cancel</Button>
            </CardFooter>
          </Card>
        </section>
      </div>

      <section className="space-y-4 border bg-card p-5 text-card-foreground">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Components
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Badge>Badge</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>
    </div>
  );
}

export function ColorsPage() {
  return (
    <div className="space-y-8 border bg-card p-6 text-card-foreground">
      <section className="space-y-4">
        <div>
          <h2 className="font-semibold font-serif">Brand colors</h2>
          <p className="text-sm text-muted-foreground">
            Primary electric yellow, neutral secondary, lime accent.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {CORE_SWATCHES.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold font-serif">Semantic and surface colors</h2>
          <p className="text-sm text-muted-foreground">
            Roles for text, backgrounds, borders, muted content, and danger.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {SUPPORTING_SWATCHES.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function FontsPage() {
  return (
    <div className="space-y-8 border bg-card p-6 text-card-foreground">
      <section className="space-y-4">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Display — Syne
        </h2>
        <p className="text-5xl font-bold font-serif tracking-tight">The quick brown fox</p>
        <p className="text-sm text-muted-foreground">
          Syne is used for all headings (h1–h6). Geometric, bold, wide — designed for impact at large sizes.
          Mapped to the <code className="font-mono text-xs bg-muted px-1 py-0.5">font-serif</code> Tailwind utility.
        </p>
      </section>

      <section className="space-y-4 border-t pt-6">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          UI / Body — Inter
        </h2>
        <p className="text-base font-sans">
          Inter carries all body copy, labels, captions, and interface text. Neutral, highly legible, 
          and designed for screens. Mapped to the <code className="font-mono text-xs bg-muted px-1 py-0.5">font-sans</code> utility.
        </p>
      </section>

      <section className="space-y-4 border-t pt-6">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Type scale
        </h2>
        {TYPE_SCALE.map((entry) => (
          <div key={entry.label} className="grid gap-2 sm:grid-cols-[120px_1fr]">
            <span className="pt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {entry.label}
            </span>
            <p className={entry.className}>{entry.sample}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export function LayoutPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="border bg-card p-6 text-card-foreground">
        <h2 className="font-semibold font-serif">Spacing</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The spacing scale, derived from the 0.25rem base spacing token.
        </p>
        <div className="mt-6 space-y-4">
          {SPACING_SCALE.map((space) => (
            <div key={space.label} className="flex items-center gap-4">
              <span className="w-8 text-xs text-muted-foreground">
                {space.label}
              </span>
              <div className={`h-3 bg-primary ${space.className}`} />
            </div>
          ))}
        </div>
      </section>

      <section className="border bg-card p-6 text-card-foreground">
        <h2 className="font-semibold font-serif">Radius</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Base radius is <strong>0rem</strong> — all corners are sharp by default.
          The design language is angular and precise.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {[
            { label: 'None (base)', className: 'rounded-none' },
            { label: 'Small', className: 'rounded-sm' },
            { label: 'Medium', className: 'rounded-md' },
            { label: 'Large', className: 'rounded-lg' },
          ].map((radius) => (
            <div
              key={radius.label}
              className={`flex h-24 items-end border bg-muted p-3 ${radius.className}`}
            >
              <span className="text-xs font-medium">{radius.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          At 0rem base, sm/md/lg all resolve to 0 or near-zero — consistent sharp corners system-wide.
        </p>
      </section>
    </div>
  );
}
