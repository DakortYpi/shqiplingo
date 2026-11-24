import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="min-h-screen w-full bg-slate-900 flex justify-center items-start sm:py-4">
      {/* 480px max-width mobile frame on desktop, full width on mobile */}
      <div className="w-full max-w-[480px] min-h-screen sm:min-h-[880px] sm:max-h-[920px] bg-slate-50 flex flex-col relative shadow-2xl sm:rounded-3xl overflow-hidden border-0 sm:border sm:border-slate-800">
        {/* Subtle mobile status bar notch simulation on desktop */}
        <div className="hidden sm:flex justify-between items-center px-6 py-1.5 bg-slate-900 text-[11px] text-slate-400 font-medium select-none z-30">
          <span>09:41</span>
          <div className="w-20 h-4 bg-slate-950 rounded-full mx-auto" />
          <div className="flex items-center space-x-1.5">
            <span>5G</span>
            <div className="w-4 h-2 border border-slate-400 rounded-sm p-0.5 flex items-center">
              <div className="h-full w-full bg-slate-400 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Inner Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
