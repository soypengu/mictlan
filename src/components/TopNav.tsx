"use client";

import Link from "next/link";
import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
  viewLabel?: string;
  children?: Array<{ href: string; label: string }>;
};

const nav: NavItem[] = [
  { href: "/", label: "Inicio" },
  {
    href: "/scrims",
    label: "Scrims",
    viewLabel: "Ver Tablas Scrims",
    children: [{ href: "/kills", label: "Kills" }],
  },
  {
    href: "/eventos",
    label: "Eventos",
    viewLabel: "Ver Eventos",
    children: [
      { href: "/torneos", label: "Torneos" },
      { href: "/equipos", label: "Equipos" },
    ],
  },
  { href: "/nosotros", label: "Comunidad", children: [{ href: "/direccion", label: "Dirección" }] },
  { href: "/clanes", label: "Clanes" },
];

export function TopNav() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-card-border bg-background/60 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-wide">MICTLAN</span>
            <span className="text-xs rounded-full border border-card-border bg-card px-2 py-0.5 text-muted">
              ARENA
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          {nav.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu((v) => (v === item.label ? null : v))}
              >
                <div className="inline-flex items-center gap-0.5">
                  <Link
                    href={item.href}
                    className="rounded-full px-3 py-1.5 transition-colors hover:bg-background/30 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={openMenu === item.label}
                    onClick={() => setOpenMenu((v) => (v === item.label ? null : item.label))}
                    className="rounded-full px-1 py-1 text-foreground/80 transition-colors hover:bg-background/30 hover:text-foreground"
                  >
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5">
                      <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </button>
                </div>
                {openMenu === item.label ? (
                  <div className="absolute left-0 top-full z-50 -mt-1 min-w-56 overflow-hidden rounded-2xl border border-brand/30 bg-background p-2 shadow-[0_24px_70px_rgba(59,130,246,0.18)]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_240px_at_15%_0%,rgba(59,130,246,0.22),transparent_60%)]" />
                    <div className="relative grid">
                      <Link
                        href={item.href}
                        className="rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-background/30"
                      >
                        {item.viewLabel ?? `Ver ${item.label}`}
                      </Link>
                      {item.children && item.children.length ? (
                        <>
                          <div className="mx-2 my-1 h-px bg-card-border/60" />
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="rounded-lg px-3 py-2 text-foreground/90 transition-colors hover:bg-background/30 hover:text-foreground"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ),
          )}
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
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-background/20 text-foreground transition-colors hover:border-brand/60 md:hidden"
          >
            <div className="grid gap-1">
              <span className="block h-0.5 w-5 bg-foreground" />
              <span className="block h-0.5 w-5 bg-foreground/90" />
              <span className="block h-0.5 w-5 bg-foreground/80" />
            </div>
          </button>
        </div>

        <div
          className={[
            "absolute left-0 right-0 top-full md:hidden",
            open ? "block" : "hidden",
          ].join(" ")}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mt-3 rounded-2xl border border-card-border bg-background/80 p-3 backdrop-blur">
              <div className="grid gap-1">
                {nav.map((item) =>
                  item.children ? (
                    <div key={item.label} className="grid gap-1">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="rounded-xl px-3 py-2 text-sm font-semibold text-foreground/90 transition-colors hover:bg-background/30 hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                      <div className="pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-xl px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-background/30 hover:text-foreground"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-foreground/90 transition-colors hover:bg-background/30 hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                  href="https://discord.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-card-border bg-background/20 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-brand/60"
                >
                  Discord
                </a>
                <a
                  href="https://twitch.tv/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-brand-2"
                >
                  Live
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

