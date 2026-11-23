import React from 'react';
import { BookOpen, Settings, RotateCcw, Brain } from 'lucide-react';
import { Mascot } from './Mascot';

interface HeaderProps {
  onOpenLearnMore: () => void;
  onOpenPresets: () => void;
  onResetToExample: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLearnMore,
  onOpenPresets,
  onResetToExample,
}) => {
  return (
    <header className="relative z-30 w-full px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b border-amber-950/40 bg-[#161021]/80 backdrop-blur-md">
      {/* Left: Mascot & Title */}
      <div className="flex items-center space-x-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-stone-800/80 border border-stone-600/50 flex items-center justify-center text-stone-300 shadow-inner">
            <Brain className="w-4 h-4 text-amber-200/90" />
          </div>
          <Mascot size="md" expression="reading" interactive={true} />
        </div>

        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#fbf5e8] drop-shadow-sm">
              DFA Minimizer
            </h1>
          </div>
          <p className="text-xs text-[#c5b59f] font-sans tracking-wide">
            Explore • Learn • Minimize
          </p>
        </div>
      </div>

      {/* Right: Controls & Actions */}
      <div className="flex items-center space-x-2.5">
        {/* Reset / Load Default */}
        <button
          onClick={onResetToExample}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-stone-300 hover:text-white bg-stone-800/60 hover:bg-stone-700/70 border border-stone-700/60 rounded-full transition shadow-sm"
          title="Reset back to example DFA"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Reset</span>
        </button>

        {/* Learn More Button */}
        <button
          onClick={onOpenLearnMore}
          className="flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold text-[#f5ebd9] bg-[#2d243b]/90 hover:bg-[#3e3252] border border-[#6b5880]/60 rounded-full shadow-md transition hover:scale-105 active:scale-95 group"
        >
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>Learn More</span>
        </button>

        {/* Presets & Settings Button */}
        <button
          onClick={onOpenPresets}
          className="p-2 text-stone-300 hover:text-white bg-[#2d243b]/90 hover:bg-[#3e3252] border border-[#6b5880]/60 rounded-full shadow-md transition hover:scale-105 active:scale-95 group"
          title="Presets & DFA Configuration"
        >
          <Settings className="w-4 h-4 text-amber-300" />
        </button>
      </div>
    </header>
  );
};
