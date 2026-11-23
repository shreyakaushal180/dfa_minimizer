import React from 'react';

export const BackgroundDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
      {/* Background Cozy Study Ambient Light & Wall Tone */}
      <div 
        className="absolute inset-0 opacity-45 mix-blend-soft-light"
        style={{
          backgroundImage: `
            radial-gradient(circle at 88% 18%, rgba(245, 158, 11, 0.32) 0%, transparent 48%),
            radial-gradient(circle at 10% 85%, rgba(217, 119, 6, 0.28) 0%, transparent 45%),
            linear-gradient(to bottom, rgba(18, 13, 26, 0.75), rgba(26, 19, 36, 0.95))
          `,
        }}
      />

      {/* ============================================================== */}
      {/* 1. TOP LEFT IVY VINES (Lush, illustrated botanicals)          */}
      {/* ============================================================== */}
      <svg
        className="absolute -top-3 -left-3 w-56 sm:w-72 h-56 sm:h-72 opacity-90 drop-shadow-xl"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vine Main Stems */}
        <path
          d="M-10 10 Q35 35 60 90 T120 145 T170 170"
          stroke="#263b24"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M-5 45 Q45 70 80 125 T140 185"
          stroke="#1b2a1a"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M50 80 Q90 100 110 135"
          stroke="#2c422a"
          strokeWidth="2.2"
          fill="none"
        />

        {/* Individual Crafted Leaves with Highlights and Shadows */}
        {/* Leaf 1 */}
        <g transform="translate(42, 45)">
          <path d="M 0 0 C 10 -15, 28 -10, 24 10 C 18 24, -2 18, 0 0 Z" fill="#365c32" stroke="#223d1f" strokeWidth="1" />
          <path d="M 2 2 Q 12 5 20 8" stroke="#50824b" strokeWidth="1" fill="none" />
        </g>
        {/* Leaf 2 */}
        <g transform="translate(68, 52)">
          <path d="M 0 0 C 12 -12, 28 -4, 22 14 C 16 26, -4 16, 0 0 Z" fill="#4d7c46" stroke="#294524" strokeWidth="1" />
          <path d="M 2 2 Q 11 6 18 10" stroke="#71a868" strokeWidth="1" fill="none" />
        </g>
        {/* Leaf 3 */}
        <g transform="translate(52, 92)">
          <path d="M 0 0 C -12 -14, -28 -4, -22 16 C -15 28, 5 18, 0 0 Z" fill="#3a6335" stroke="#233d20" strokeWidth="1" />
          <path d="M -2 2 Q -11 6 -18 12" stroke="#5b9454" strokeWidth="1" fill="none" />
        </g>
        {/* Leaf 4 */}
        <g transform="translate(86, 115)">
          <path d="M 0 0 C 14 -10, 28 2, 22 20 C 14 30, -6 20, 0 0 Z" fill="#477340" stroke="#284424" strokeWidth="1" />
          <path d="M 2 2 Q 12 8 18 15" stroke="#689f5f" strokeWidth="1" fill="none" />
        </g>
        {/* Leaf 5 */}
        <g transform="translate(112, 138)">
          <path d="M 0 0 C 12 -12, 26 -2, 20 16 C 14 26, -4 16, 0 0 Z" fill="#365c32" stroke="#203a1d" strokeWidth="1" />
          <path d="M 2 2 Q 10 6 16 11" stroke="#568c50" strokeWidth="1" fill="none" />
        </g>
        {/* Leaf 6 */}
        <g transform="translate(138, 172)">
          <path d="M 0 0 C 10 -10, 22 0, 16 15 C 10 24, -4 14, 0 0 Z" fill="#4a7a43" stroke="#264223" strokeWidth="1" />
        </g>
        {/* Small sprout leaves */}
        <path d="M 26 72 C 18 64, 30 52, 42 62 C 48 70, 36 82, 26 72 Z" fill="#588e51" />
        <path d="M 100 98 C 110 88, 126 94, 120 108 C 114 118, 96 112, 100 98 Z" fill="#3e6839" />
        <path d="M 148 150 C 158 140, 174 146, 168 160 C 162 170, 144 164, 148 150 Z" fill="#4d7c46" />
      </svg>

      {/* ============================================================== */}
      {/* 2. TOP RIGHT HANGING LANTERN (Rich fantasy brass & iron lantern) */}
      {/* ============================================================== */}
      <div className="absolute top-0 right-4 sm:right-12 flex flex-col items-center">
        {/* Wrought Iron Mounting Bracket & Ring */}
        <svg className="w-10 h-8 -mb-1" viewBox="0 0 40 30" fill="none">
          <path d="M 20 0 L 20 16" stroke="#2c1e14" strokeWidth="3" />
          <circle cx="20" cy="22" r="5" stroke="#483222" strokeWidth="2.5" fill="none" />
        </svg>

        {/* Sturdy Antiqued Iron Chain Links */}
        <div className="flex flex-col items-center -space-y-1">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-3.5 rounded-full border-2 border-[#3d291b] bg-[#22160d] shadow-sm"
            />
          ))}
        </div>

        {/* Hanging Lantern Body */}
        <div className="relative mt-0.5">
          {/* Ambient Warm Golden Halo Glow */}
          <div className="absolute -inset-10 bg-amber-400/30 rounded-full blur-3xl pointer-events-none" />

          <svg className="w-24 sm:w-28 h-36 sm:h-44 drop-shadow-2xl" viewBox="0 0 100 150" fill="none">
            <defs>
              {/* Brass/Bronze Gradients */}
              <linearGradient id="bronzeGrad" x1="10" y1="20" x2="90" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#5c3e21" />
                <stop offset="0.3" stopColor="#9a6e3e" />
                <stop offset="0.7" stopColor="#c59858" />
                <stop offset="1" stopColor="#432c16" />
              </linearGradient>

              {/* Lantern Glass Warm Glow Gradient */}
              <linearGradient id="lanternGlassGlow" x1="50" y1="40" x2="50" y2="110" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fffbeb" stopOpacity="0.9" />
                <stop offset="0.4" stopColor="#fef3c7" stopOpacity="0.8" />
                <stop offset="0.8" stopColor="#f59e0b" stopOpacity="0.5" />
                <stop offset="1" stopColor="#d97706" stopOpacity="0.3" />
              </linearGradient>

              {/* Flame Radiance */}
              <radialGradient id="flameRadial" cx="50" cy="78" r="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" />
                <stop offset="0.3" stopColor="#fef08a" />
                <stop offset="0.7" stopColor="#f59e0b" />
                <stop offset="1" stopColor="#d97706" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Top Loop & Cap Finial */}
            <circle cx="50" cy="12" r="7" stroke="url(#bronzeGrad)" strokeWidth="3.5" fill="none" />
            <path d="M 44 19 L 56 19 L 58 25 L 42 25 Z" fill="url(#bronzeGrad)" stroke="#2d1c0e" strokeWidth="1" />

            {/* Lantern Roof / Canopy (Tiered Pagoda/Pavilion Cap) */}
            <path
              d="M 50 25 L 78 39 L 84 44 L 16 44 L 22 39 Z"
              fill="url(#bronzeGrad)"
              stroke="#2c1a0c"
              strokeWidth="2"
            />
            {/* Ventilation Louvre Trim */}
            <rect x="26" y="42" width="48" height="4" rx="1.5" fill="#2d1b0d" />

            {/* Glowing Glass Chamber (Six-sided tapered glass) */}
            <path
              d="M 24 46 L 76 46 L 68 114 L 32 114 Z"
              fill="url(#lanternGlassGlow)"
              stroke="#382110"
              strokeWidth="2"
            />

            {/* Candle Base & Wax inside */}
            <rect x="44" y="86" width="12" height="26" rx="2" fill="#fffbeb" stroke="#d5c09a" strokeWidth="1" />
            {/* Dripping wax droplets */}
            <path d="M 44 88 Q 42 94 44 98" stroke="#f5ede0" strokeWidth="1.5" strokeLinecap="round" />

            {/* Warm Candle Light Aura */}
            <circle cx="50" cy="74" r="22" fill="url(#flameRadial)" />

            {/* Flame */}
            <path
              d="M 50 62 C 55 69, 56 74, 50 82 C 44 74, 45 69, 50 62 Z"
              fill="#f59e0b"
            />
            <path
              d="M 50 66 C 53 71, 53 75, 50 80 C 47 75, 47 71, 50 66 Z"
              fill="#fef08a"
            />
            {/* White-hot flame center */}
            <ellipse cx="50" cy="75" rx="1.5" ry="3.5" fill="#ffffff" />

            {/* Wrought Iron Glass Cage Framework (Bars & Corner Ribs) */}
            <line x1="50" y1="46" x2="50" y2="114" stroke="#4a301a" strokeWidth="2.5" />
            <line x1="37" y1="46" x2="41" y2="114" stroke="#4a301a" strokeWidth="1.8" opacity="0.8" />
            <line x1="63" y1="46" x2="59" y2="114" stroke="#4a301a" strokeWidth="1.8" opacity="0.8" />
            
            {/* Horizontal Middle Protective Band */}
            <path d="M 28 80 L 72 80" stroke="#3b2311" strokeWidth="2.2" />

            {/* Lantern Base Platform */}
            <path
              d="M 28 114 L 72 114 L 76 126 L 24 126 Z"
              fill="url(#bronzeGrad)"
              stroke="#2c1a0c"
              strokeWidth="2"
            />
            {/* Bottom Finial Drop */}
            <circle cx="50" cy="130" r="4" fill="url(#bronzeGrad)" stroke="#2b1a0e" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. BOTTOM LEFT DESK LANTERN & ANTIQUE LEATHER BOOKS STACK       */}
      {/* ============================================================== */}
      <div className="hidden lg:flex absolute bottom-3 left-6 flex-col items-center">
        {/* Warm Ambient Desk Lamp Halo */}
        <div className="absolute -inset-12 bg-amber-400/25 rounded-full blur-3xl pointer-events-none" />

        {/* Vintage Desk Hurricane Oil Lantern */}
        <svg className="w-18 h-28 -mb-3 z-10 drop-shadow-2xl" viewBox="0 0 70 100" fill="none">
          <defs>
            <linearGradient id="brassBaseGrad" x1="15" y1="65" x2="55" y2="65" gradientUnits="userSpaceOnUse">
              <stop stopColor="#66461f" />
              <stop offset="0.4" stopColor="#b48342" />
              <stop offset="0.7" stopColor="#dcab64" />
              <stop offset="1" stopColor="#4f3314" />
            </linearGradient>
            <linearGradient id="deskGlassGrad" x1="35" y1="20" x2="35" y2="65" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fffef0" stopOpacity="0.85" />
              <stop offset="0.5" stopColor="#fef08a" stopOpacity="0.6" />
              <stop offset="1" stopColor="#f59e0b" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Top Hanging Ring Handle (Tilted) */}
          <path d="M 35 8 C 22 8, 22 22, 35 22 C 48 22, 48 8, 35 8 Z" stroke="url(#brassBaseGrad)" strokeWidth="2.5" fill="none" />
          
          {/* Glass Chimney (Bulbous curved hurricane chimney) */}
          <path
            d="M 30 20 L 40 20 Q 42 32 49 42 Q 52 50 48 62 L 22 62 Q 18 50 21 42 Q 28 32 30 20 Z"
            fill="url(#deskGlassGrad)"
            stroke="#593b1d"
            strokeWidth="1.5"
          />

          {/* Candle Flame inside */}
          <ellipse cx="35" cy="46" rx="14" ry="14" fill="#f59e0b" opacity="0.35" />
          <path d="M 35 36 C 39 42, 40 47, 35 53 C 30 47, 31 42, 35 36 Z" fill="#f59e0b" />
          <path d="M 35 40 C 37 44, 37 47, 35 51 C 33 47, 33 44, 35 40 Z" fill="#fef08a" />
          <circle cx="35" cy="48" r="1.5" fill="#ffffff" />

          {/* Brass Burner & Oil Tank Reservoir */}
          <rect x="24" y="62" width="22" height="6" rx="1.5" fill="url(#brassBaseGrad)" stroke="#39220d" strokeWidth="1" />
          <path
            d="M 18 68 L 52 68 L 56 86 L 14 86 Z"
            fill="url(#brassBaseGrad)"
            stroke="#341f0a"
            strokeWidth="1.5"
          />
          {/* Base Rim Flange */}
          <rect x="12" y="86" width="46" height="6" rx="2" fill="url(#brassBaseGrad)" stroke="#341f0a" strokeWidth="1.5" />
        </svg>

        {/* Stack of 3 Luxurious Antique Leather-Bound Books */}
        <svg className="w-32 h-24 drop-shadow-2xl z-0" viewBox="0 0 130 90" fill="none">
          <defs>
            {/* Gilded Book Page Edges */}
            <linearGradient id="goldEdgeGrad" x1="15" y1="0" x2="115" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f3e5ab" />
              <stop offset="0.5" stopColor="#fff8db" />
              <stop offset="1" stopColor="#dfca8b" />
            </linearGradient>
          </defs>

          {/* ================= BOOK 1 (BOTTOM - Deep Rich Oxblood Leather) ================= */}
          {/* Leather Cover Bottom Flange */}
          <rect x="5" y="66" width="120" height="22" rx="3.5" fill="#421419" stroke="#25090d" strokeWidth="2" />
          {/* Gilded Page Edges */}
          <rect x="16" y="69" width="105" height="15" fill="url(#goldEdgeGrad)" stroke="#b89e60" strokeWidth="1" />
          {/* Page Texture Lines */}
          <line x1="20" y1="73" x2="118" y2="73" stroke="#d5be87" strokeWidth="0.8" />
          <line x1="20" y1="77" x2="118" y2="77" stroke="#d5be87" strokeWidth="0.8" />
          <line x1="20" y1="81" x2="118" y2="81" stroke="#d5be87" strokeWidth="0.8" />
          {/* Leather Spine with Gold Ribs */}
          <path d="M 5 66 L 16 66 L 16 88 L 5 88 Z" fill="#581a21" stroke="#25090d" strokeWidth="1.5" />
          <line x1="6" y1="71" x2="15" y2="71" stroke="#f6c451" strokeWidth="1.8" />
          <line x1="6" y1="77" x2="15" y2="77" stroke="#f6c451" strokeWidth="1.8" />
          <line x1="6" y1="83" x2="15" y2="83" stroke="#f6c451" strokeWidth="1.8" />

          {/* ================= BOOK 2 (MIDDLE - Midnight Navy with Gold Stars) ============= */}
          {/* Book 2 Cover */}
          <rect x="12" y="40" width="104" height="22" rx="3" fill="#14213d" stroke="#080e1c" strokeWidth="2" />
          {/* Gilded Page Edges */}
          <rect x="22" y="43" width="90" height="15" fill="url(#goldEdgeGrad)" stroke="#b89e60" strokeWidth="1" />
          <line x1="26" y1="47" x2="108" y2="47" stroke="#d5be87" strokeWidth="0.8" />
          <line x1="26" y1="51" x2="108" y2="51" stroke="#d5be87" strokeWidth="0.8" />
          <line x1="26" y1="55" x2="108" y2="55" stroke="#d5be87" strokeWidth="0.8" />
          {/* Spine */}
          <path d="M 12 40 L 22 40 L 22 62 L 12 62 Z" fill="#1c2f54" stroke="#080e1c" strokeWidth="1.5" />
          <circle cx="17" cy="46" r="2" fill="#f6c451" />
          <circle cx="17" cy="51" r="2.5" fill="#f6c451" />
          <circle cx="17" cy="56" r="2" fill="#f6c451" />
          {/* Silk Crimson Bookmark Ribbon Dangling Over Lower Book */}
          <path
            d="M 98 42 C 104 55, 106 68, 102 78 L 97 76 L 100 71 Z"
            fill="#b91c1c"
            stroke="#7f1d1d"
            strokeWidth="0.8"
          />

          {/* ================= BOOK 3 (TOP - Forest Green Grimoire) ======================== */}
          <rect x="20" y="16" width="90" height="20" rx="3" fill="#1a3821" stroke="#0d1f12" strokeWidth="2" />
          <rect x="30" y="19" width="76" height="13" fill="url(#goldEdgeGrad)" stroke="#b89e60" strokeWidth="1" />
          <line x1="34" y1="23" x2="102" y2="23" stroke="#d5be87" strokeWidth="0.8" />
          <line x1="34" y1="27" x2="102" y2="27" stroke="#d5be87" strokeWidth="0.8" />
          {/* Spine */}
          <path d="M 20 16 L 30 16 L 30 36 L 20 36 Z" fill="#244d2d" stroke="#0d1f12" strokeWidth="1.5" />
          <line x1="21" y1="21" x2="29" y2="21" stroke="#f6c451" strokeWidth="1.5" />
          <line x1="21" y1="26" x2="29" y2="26" stroke="#f6c451" strokeWidth="1.5" />
          <line x1="21" y1="31" x2="29" y2="31" stroke="#f6c451" strokeWidth="1.5" />
          {/* Brass Clasp on Top Book */}
          <rect x="68" y="21" width="8" height="9" rx="1.5" fill="#eab308" stroke="#854d0e" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};
