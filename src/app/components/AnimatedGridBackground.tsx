'use client';

import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";

const GRID_SIZE = 40;

const AnimatedGridBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
      {/* Subtle background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f6fafd] via-[#e9f1fa] to-[#f8fafc] dark:from-[#181f2a] dark:via-[#232b3a] dark:to-[#101624] transition-colors duration-500" />
      {/* Centered interactive grid pattern */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <InteractiveGridPattern
          width={GRID_SIZE}
          height={GRID_SIZE}
          squares={[36, 20]} // Adjust for density and screen size
          className="w-full h-full opacity-60"
          squaresClassName="stroke-gray-300/30 dark:stroke-gray-600/30"
        />
      </div>
    </div>
  );
};

export default AnimatedGridBackground;