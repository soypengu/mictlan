export function Footer() {
  return (
    <footer className="border-t border-card-border bg-background/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>© {new Date().getFullYear()} MICTLAN ARENA</div>
        <div className="flex items-center gap-3">
          <a
            href="https://discord.com/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-card-border bg-card px-3 py-1 transition-colors hover:border-brand/60"
          >
            Discord
          </a>
          <a
            href="#top"
            className="rounded-full border border-card-border bg-card px-3 py-1 transition-colors hover:border-brand/60"
          >
            Volver arriba
          </a>
        </div>
      </div>
    </footer>
  );
}

