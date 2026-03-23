import { ReactNode } from "react";

export function Section({
  id,
  title,
  subtitle,
  actions,
  borderless,
  unstyled,
  children,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  borderless?: boolean;
  unstyled?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      {unstyled ? (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h2>
              {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
          <div className="mt-5">{children}</div>
        </>
      ) : (
        <div
          className={[
            "rounded-3xl bg-background/10 px-6 py-6 backdrop-blur sm:px-8",
            borderless ? "" : "border border-card-border",
          ].join(" ")}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h2>
              {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
          <div className="mt-5">{children}</div>
        </div>
      )}
    </section>
  );
}

