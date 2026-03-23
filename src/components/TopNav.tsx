import Link from "next/link";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/eventos", label: "Eventos" },
  { href: "/scrims", label: "Scrims" },
  { href: "/torneos", label: "Torneos" },
  { href: "/kills", label: "Kills" },
  { href: "/equipos", label: "Equipos" },
  { href: "/nosotros", label: "Comunidad" },
  { href: "/direccion", label: "Dirección" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-card-border bg-background/60 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-wide">MICTLAN</span>
            <span className="text-xs rounded-full border border-card-border bg-card px-2 py-0.5 text-muted">
              ARENA
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="https://discord.com/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center justify-center rounded-full border border-card-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/60"
          >
            Discord
          </a>
          <a
            href="https://twitch.tv/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-brand-2"
          >
            Live
          </a>
        </div>
      </div>
    </header>
  );
}

