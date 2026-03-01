import { GenerateForm } from "@/components/GenerateForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-4 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-bold font-mono text-xs">$</span>
          </div>
          <span className="font-semibold text-foreground tracking-tight">
            MoneyPrinter
          </span>
        </div>
        <span className="text-xs text-muted-foreground border border-border rounded px-2 py-0.5 font-mono">
          v2.0
        </span>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 py-10 md:py-16">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          {/* Hero */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-balance text-foreground">
              Generer un YouTube Short
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty max-w-lg">
              Automatisez la creation et le telechargement de vos YouTube Shorts
              grace a l&apos;IA. Entrez un sujet, configurez vos options et
              lancez la generation.
            </p>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Backend requis sur{" "}
            <code className="font-mono text-foreground bg-muted px-1 py-0.5 rounded text-xs">
              localhost:8080
            </code>
          </div>

          {/* Form */}
          <GenerateForm />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        Fait avec soin par{" "}
        <a
          href="https://github.com/FujiwaraChoki"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Fuji Codes
        </a>
      </footer>
    </main>
  );
}
