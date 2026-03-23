export function Hero() {
  return (
    <section className="pt-14 sm:pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-card-border bg-background/10 px-6 py-14 backdrop-blur sm:px-10 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/18 via-transparent to-brand-2/12" />
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-brand/20 blur-3xl ma-float" />
          <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-brand-2/14 blur-3xl ma-float-delayed" />
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center ma-fade-up">
            <div className="rounded-full border border-card-border bg-background/30 px-3 py-1 text-xs text-muted">
              Era Mictlán · El Poder Ancestral Despierta
            </div>
            <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight">
              <span className="bg-gradient-to-b from-brand-2 to-brand bg-clip-text text-transparent">
                MICTLAN
              </span>{" "}
              <span className="text-foreground">ARENA</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-muted">
              Web competitiva para torneos y scrims de Garena Delta Force: tablas, estadísticas y
              próximos eventos en un solo lugar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://twitch.tv/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-2 ma-pop"
              >
                Live Streaming
              </a>
              <a
                href="/equipos"
                className="inline-flex items-center justify-center rounded-xl border border-card-border bg-background/30 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand/60 ma-pop"
              >
                Explorar Equipos
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

