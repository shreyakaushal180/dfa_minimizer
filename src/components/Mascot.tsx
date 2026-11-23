import React, { useState } from 'react';

export type MascotExpression = 'reading' | 'happy' | 'thinking' | 'waving' | 'celebrating';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: MascotExpression;
  className?: string;
  interactive?: boolean;
  speechText?: string;
  showSpeechBubble?: boolean;
  onMascotClick?: () => void;
}

const SCHOLAR_TIPS = [
  "Bip-boop! Ready to minimize some states! 📚",
  "Equivalent states behave identically on every possible string! ✨",
  "Hopcroft's partition refinement runs in O(n log n) time! ⚡",
  "Every regular language has a unique minimal DFA! 🎯",
  "Accepting and non-accepting states can never be merged! 💡",
  "Compilers minimize DFAs for lightning-fast lexical analysis! 🚀",
  "Click 'Next Step' to see equivalent states consolidate! 🪄",
];

export const Mascot: React.FC<MascotProps> = ({
  size = 'md',
  expression: propExpression = 'reading',
  className = '',
  interactive = true,
  speechText,
  showSpeechBubble = false,
  onMascotClick,
}) => {
  const [isExcited, setIsExcited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [showInteractiveBubble, setShowInteractiveBubble] = useState(false);

  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    e.stopPropagation();

    setIsExcited(true);
    setTipIndex((prev) => (prev + 1) % SCHOLAR_TIPS.length);
    setShowInteractiveBubble(true);

    if (onMascotClick) {
      onMascotClick();
    }

    setTimeout(() => setIsExcited(false), 700);
    // Hide interactive speech bubble after 4 seconds
    setTimeout(() => setShowInteractiveBubble(false), 4500);
  };

  // Determine current active expression
  const currentExpression: MascotExpression = isExcited
    ? 'celebrating'
    : isHovered
    ? 'happy'
    : propExpression;

  const activeSpeech = showInteractiveBubble
    ? SCHOLAR_TIPS[tipIndex]
    : speechText;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      title={interactive ? 'Click the Scholar Robot for automata tips!' : undefined}
    >
      {/* Warm Ambient Glow Aura */}
      <div
        className={`absolute inset-0 rounded-full blur-md -z-10 transition-all duration-300 ${
          isHovered || isExcited ? 'bg-amber-400/40 scale-125' : 'bg-amber-400/20 scale-100'
        }`}
      />

      {/* Floating Sparkles & Hearts on Click */}
      {isExcited && (
        <div className="absolute -top-4 -right-2 pointer-events-none flex items-center gap-1 z-30 animate-pop-in">
          <span className="text-amber-400 text-sm">✨</span>
          <span className="text-pink-400 text-xs">💛</span>
        </div>
      )}

      {/* Interactive Speech Bubble */}
      {(showSpeechBubble || showInteractiveBubble) && activeSpeech && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap z-40 bg-[#fffefb] border-1.5 border-[#d8c29d] px-3 py-1.5 rounded-xl shadow-xl text-xs font-serif font-semibold text-[#3b2b1d] animate-pop-in pointer-events-none">
          <span>{activeSpeech}</span>
          {/* Bubble tail pointer */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#fffefb] border-r border-b border-[#d8c29d] rotate-45" />
        </div>
      )}

      {/* Mascot Animated Body Container */}
      <div
        className={`w-full h-full transition-all duration-200 ${
          isExcited
            ? 'animate-mascot-hop'
            : isHovered
            ? 'scale-110 -rotate-2'
            : 'animate-mascot'
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Hood cloak gradient */}
            <linearGradient id="hoodGrad" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a3704c" />
              <stop offset="0.6" stopColor="#7a4f32" />
              <stop offset="1" stopColor="#54331d" />
            </linearGradient>

            {/* Robe body gradient */}
            <linearGradient id="robeGrad" x1="25" y1="50" x2="75" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8d5f3f" />
              <stop offset="1" stopColor="#4f311c" />
            </linearGradient>

            {/* Robot metal face gradient */}
            <linearGradient id="robotFaceGrad" x1="30" y1="25" x2="70" y2="65" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f3f4f8" />
              <stop offset="1" stopColor="#d4d8e6" />
            </linearGradient>

            {/* Dark visor gradient */}
            <linearGradient id="visorGrad" x1="35" y1="36" x2="65" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1a2035" />
              <stop offset="1" stopColor="#0e1322" />
            </linearGradient>

            {/* Glowing book gradient */}
            <linearGradient id="bookCoverGrad" x1="30" y1="70" x2="70" y2="95" gradientUnits="userSpaceOnUse">
              <stop stopColor="#b45309" />
              <stop offset="1" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="pageGlow" x1="35" y1="65" x2="65" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fffbeb" />
              <stop offset="1" stopColor="#fef3c7" />
            </linearGradient>
          </defs>

          {/* --- RISING MAGICAL RUNES / SPARKLES FROM BOOK --- */}
          <g className="animate-rune" opacity="0.8">
            <circle cx="48" cy="68" r="1.5" fill="#f59e0b" />
            <circle cx="53" cy="65" r="1.2" fill="#fbbf24" />
          </g>

          {/* --- BACK HOOD SHADOW --- */}
          <path
            d="M22 45 C18 25, 32 10, 50 10 C68 10, 82 25, 78 45 C75 58, 70 70, 50 72 C30 70, 25 58, 22 45 Z"
            fill="#3b2314"
          />

          {/* --- COZY CLOAK HOOD --- */}
          <path
            d="M24 46 C20 28, 32 12, 50 12 C68 12, 80 28, 76 46 C72 62, 65 68, 50 70 C35 68, 28 62, 24 46 Z"
            fill="url(#hoodGrad)"
            stroke="#422513"
            strokeWidth="2.5"
          />

          {/* --- HOOD TRIM / FOLD --- */}
          <path
            d="M27 38 C32 20, 68 20, 73 38 C75 48, 72 58, 50 63 C28 58, 25 48, 27 38 Z"
            fill="#52321c"
            opacity="0.6"
          />

          {/* --- ROBOT ROUND HEAD / VISOR CASING --- */}
          <circle cx="50" cy="42" r="19" fill="url(#robotFaceGrad)" stroke="#4a5568" strokeWidth="2" />

          {/* --- DARK VISOR SCREEN --- */}
          <rect x="34" y="32" width="32" height="20" rx="9" fill="url(#visorGrad)" stroke="#2d3748" strokeWidth="1.5" />

          {/* --- VISOR REFLECTION SHINE --- */}
          <path d="M37 35 Q45 34 56 36" stroke="#4fd1c5" strokeWidth="1" strokeLinecap="round" opacity="0.4" />

          {/* --- MASCOT EYES (WITH BLINK & EXPRESSIONS) --- */}
          <g className="animate-mascot-blink">
            {currentExpression === 'celebrating' ? (
              /* Star Sparkle Eyes ★ ★ */
              <>
                <path d="M43 38 L44 41 L47 42 L44 43 L43 46 L42 43 L39 42 L42 41 Z" fill="#38bdf8" />
                <path d="M57 38 L58 41 L61 42 L58 43 L57 46 L56 43 L53 42 L56 41 Z" fill="#38bdf8" />
                <ellipse cx="38" cy="47" rx="2.5" ry="1.2" fill="#f472b6" opacity="0.9" />
                <ellipse cx="62" cy="47" rx="2.5" ry="1.2" fill="#f472b6" opacity="0.9" />
              </>
            ) : currentExpression === 'happy' || currentExpression === 'waving' ? (
              /* Happy Arch Smiling Eyes ^^ */
              <>
                <path d="M39 43 Q43 37 47 43" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                <path d="M53 43 Q57 37 61 43" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                <ellipse cx="38" cy="47" rx="2.5" ry="1.2" fill="#f472b6" opacity="0.8" />
                <ellipse cx="62" cy="47" rx="2.5" ry="1.2" fill="#f472b6" opacity="0.8" />
              </>
            ) : currentExpression === 'thinking' ? (
              /* Thinking / Curious Wide Eyes */
              <>
                <circle cx="43" cy="40" r="4.2" fill="#38bdf8" />
                <circle cx="44.5" cy="38.5" r="1.6" fill="#ffffff" />
                <circle cx="57" cy="40" r="4.2" fill="#38bdf8" />
                <circle cx="58.5" cy="38.5" r="1.6" fill="#ffffff" />
              </>
            ) : (
              /* Reading / Focused Downward Eyes */
              <>
                <ellipse cx="43" cy="42" rx="4" ry="4.5" fill="#38bdf8" />
                <circle cx="44.5" cy="40.5" r="1.5" fill="#ffffff" />
                <ellipse cx="57" cy="42" rx="4" ry="4.5" fill="#38bdf8" />
                <circle cx="58.5" cy="40.5" r="1.5" fill="#ffffff" />
                <ellipse cx="38" cy="48" rx="2.5" ry="1.2" fill="#f472b6" opacity="0.6" />
                <ellipse cx="62" cy="48" rx="2.5" ry="1.2" fill="#f472b6" opacity="0.6" />
              </>
            )}
          </g>

          {/* --- ROBOT EAR ANTENNA / HEADPHONES (WITH CYAN LED) --- */}
          <circle cx="30" cy="42" r="3.5" fill="#4a5568" stroke="#2d3748" strokeWidth="1.5" />
          <circle cx="30" cy="42" r="1.5" fill="#38bdf8" />
          <circle cx="70" cy="42" r="3.5" fill="#4a5568" stroke="#2d3748" strokeWidth="1.5" />
          <circle cx="70" cy="42" r="1.5" fill="#38bdf8" />

          {/* --- COAT BODY / TORSO --- */}
          <path
            d="M26 62 C24 75, 20 88, 18 96 L82 96 C80 88, 76 75, 74 62 C68 64, 32 64, 26 62 Z"
            fill="url(#robeGrad)"
            stroke="#422513"
            strokeWidth="2"
          />

          {/* Warm Scarf / Cloak knot */}
          <path
            d="M36 60 C42 66, 58 66, 64 60 C66 65, 62 70, 50 71 C38 70, 34 65, 36 60 Z"
            fill="#c28b5e"
            stroke="#54331d"
            strokeWidth="1.5"
          />

          {/* --- COZY OPEN BOOK IN HANDS --- */}
          <path
            d="M26 77 L48 83 L48 95 L24 88 Z"
            fill="url(#bookCoverGrad)"
            stroke="#451a03"
            strokeWidth="1.5"
          />
          <path
            d="M74 77 L52 83 L52 95 L76 88 Z"
            fill="url(#bookCoverGrad)"
            stroke="#451a03"
            strokeWidth="1.5"
          />

          {/* Book Pages with warm glow */}
          <path
            d="M28 76 Q38 80 49 81 L49 92 Q38 90 27 86 Z"
            fill="url(#pageGlow)"
            stroke="#d97706"
            strokeWidth="1"
          />
          <path
            d="M72 76 Q62 80 51 81 L51 92 Q62 90 73 86 Z"
            fill="url(#pageGlow)"
            stroke="#d97706"
            strokeWidth="1"
          />

          {/* Inked Rune Lines on Pages */}
          <line x1="32" y1="79" x2="44" y2="81" stroke="#b45309" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="32" y1="83" x2="42" y2="85" stroke="#b45309" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="56" y1="81" x2="68" y2="79" stroke="#b45309" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="58" y1="85" x2="68" y2="83" stroke="#b45309" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

          {/* Robot mitten hands */}
          <ellipse cx="28" cy="80" rx="4" ry="3.5" fill="#e2e8f0" stroke="#475569" strokeWidth="1.2" />
          <ellipse cx="72" cy="80" rx="4" ry="3.5" fill="#e2e8f0" stroke="#475569" strokeWidth="1.2" />

          {/* Warm Sparkle rising from book */}
          <path
            d="M50 71 L51.5 75 L55.5 76.5 L51.5 78 L50 82 L48.5 78 L44.5 76.5 L48.5 75 Z"
            fill="#fbbf24"
          />
        </svg>
      </div>
    </div>
  );
};
