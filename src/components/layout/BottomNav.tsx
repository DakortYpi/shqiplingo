'use client';

import React from 'react';
import { BookOpen, Layers, Bot, User, Gamepad2 } from 'lucide-react';
import { useApp, TabType } from '../../context/AppContext';

export function BottomNav() {
  const { activeTab, setActiveTab, stats } = useApp();

  const unlearnedCardsCount = stats.reviewCards.filter((c) => !c.learned).length;

  const navItems: { tab: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { tab: 'lernen', label: 'Lernen', icon: BookOpen },
    { tab: 'wiederholen', label: 'Wiederholen', icon: Layers },
    { tab: 'ki-tutor', label: 'KI-Tutor', icon: Bot },
    { tab: 'spiele', label: 'Spiele', icon: Gamepad2 },
    { tab: 'profil', label: 'Profil', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around select-none">
      {navItems.map(({ tab, label, icon: Icon }) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition relative group ${
              isActive ? 'text-red-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <div className="relative">
              <div
                className={`p-1.5 rounded-2xl transition duration-200 ${
                  isActive ? 'bg-red-50 text-red-600 scale-110 shadow-xs' : 'group-hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>

              {/* Review notification badge */}
              {tab === 'wiederholen' && unlearnedCardsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {unlearnedCardsCount}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
