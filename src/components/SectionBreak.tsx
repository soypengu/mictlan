export function SectionBreak() {
  return (
    <div className="relative my-10 sm:my-12">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 -z-10 h-12 bg-gradient-to-r from-transparent via-brand/25 to-transparent blur-2xl opacity-60" />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-card-border to-transparent" />
    </div>
  );
}
