export function PageHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <section className="pt-10 sm:pt-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-card-border bg-card/55 px-6 py-10 backdrop-blur sm:px-10">
          <div className="flex flex-col gap-3">
            {badge ? (
              <div className="inline-flex w-fit rounded-full border border-card-border bg-background/30 px-3 py-1 text-xs text-muted">
                {badge}
              </div>
            ) : null}
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h1>
            {subtitle ? <p className="max-w-3xl text-sm leading-7 text-muted">{subtitle}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
