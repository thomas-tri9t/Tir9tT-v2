export function Tri9tLogo({
  className = "",
  showWordmark = true,
  size = 28,
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="grid place-items-center rounded-md bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold shadow-sm"
        style={{ height: size, width: size, fontSize: size * 0.45 }}
        aria-label="TRI9T"
      >
        T
      </span>
      {showWordmark && (
        <span
          className="font-semibold tracking-[-0.01em] text-foreground"
          style={{ fontSize: size * 0.58, letterSpacing: "-0.01em" }}
        >
          TRI<span className="text-primary">9</span>T
        </span>
      )}
    </span>
  );
}
