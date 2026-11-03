function Pivi({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* leaf */}
      <path d="M24 9 C24 4, 30 2, 34 3 C34 8, 30 11, 24 9 Z" fill="#74C69D" />
      <path d="M24 10 L24 5" stroke="#1B4332" strokeWidth="1.6" strokeLinecap="round" />
      {/* coin body */}
      <circle cx="24" cy="27" r="16" fill="#FAF8F3" stroke="#1B4332" strokeWidth="2" />
      <circle cx="24" cy="27" r="12" fill="none" stroke="#1B4332" strokeOpacity="0.15" strokeWidth="1.5" />
      {/* eyes */}
      <circle cx="18.5" cy="25" r="2.2" fill="#1B4332" />
      <circle cx="29.5" cy="25" r="2.2" fill="#1B4332" />
      <circle cx="19.2" cy="24.3" r="0.7" fill="#FAF8F3" />
      <circle cx="30.2" cy="24.3" r="0.7" fill="#FAF8F3" />
      {/* smile */}
      <path d="M18.5 31 Q24 36 29.5 31" stroke="#1B4332" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* cheeks */}
      <circle cx="15" cy="30" r="2" fill="#74C69D" fillOpacity="0.5" />
      <circle cx="33" cy="30" r="2" fill="#74C69D" fillOpacity="0.5" />
    </svg>
  );
}

export default function ChatBubble() {
  return (
    <a
      href="/chat"
      aria-label="Chat with Pivi, the Pivotly assistant"
      className="fixed right-5 top-24 z-50 flex items-center gap-2 rounded-full bg-forest py-2 pl-2 pr-4 text-sm text-white shadow-lg transition hover:bg-forest-dark"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream">
        <Pivi size={38} />
      </span>
      <span className="hidden sm:inline">Hi, I'm Pivi!</span>
    </a>
  );
}
