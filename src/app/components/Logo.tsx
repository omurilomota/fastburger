export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Fast Burger">
      <g stroke="#16120d" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <path d="M9 27c0-9.4 10.05-17 23-17s23 7.6 23 17H9Z" fill="#f7b500" />
        <path d="M6 27h52l-5 8H11L6 27Z" fill="#3d7a3d" />
        <path d="M8 41h48a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8Z" fill="#e03b23" />
        <path d="M7 34h50v6H34l-5 8-5-8H7v-6Z" fill="#f7b500" />
        <path d="M10 49h44v1.5c0 4.3-6.4 6.5-22 6.5S10 54.8 10 50.5V49Z" fill="#f7b500" />
      </g>
      <g fill="#16120d">
        <ellipse cx="23.5" cy="19" rx="2.3" ry="1.6" transform="rotate(-18 23.5 19)" />
        <ellipse cx="33" cy="15" rx="2.3" ry="1.6" transform="rotate(8 33 15)" />
        <ellipse cx="41.5" cy="20" rx="2.3" ry="1.6" transform="rotate(-14 41.5 20)" />
      </g>
    </svg>
  );
}

export function Logo({ tagline = true }: { tagline?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className="grid place-items-center w-10 h-10 sm:w-12 sm:h-12 bg-cream border-[3px] border-ink rounded-full shrink-0">
        <LogoMark className="w-7 h-7 sm:w-8 sm:h-8" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-[22px] sm:text-[27px] tracking-[0.01em] uppercase">
          Fast<span className="text-tomato"> Burger</span>
        </span>
        {tagline && (
          <span className="hidden sm:block mt-0.5 text-[9.5px] font-semibold uppercase tracking-[0.28em] text-ink-soft">
            Dracena · Junqueirópolis
          </span>
        )}
      </span>
    </span>
  );
}
