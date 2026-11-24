'use client';

import React from 'react';
import { Check, Lock, Star, ChevronRight } from 'lucide-react';
import { allUnits } from '../../data/lessons';
import { useApp } from '../../context/AppContext';

export function LearningPath() {
  const { stats, startLesson } = useApp();

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-8 pb-20 select-none">
      {allUnits.map((unit, unitIdx) => {
        return (
          <section key={unit.id} className="space-y-4">
            {/* Unit Header Banner */}
            <div
              className="p-4 rounded-3xl text-white shadow-md relative overflow-hidden"
              style={{ backgroundColor: unit.accentColor }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase font-extrabold tracking-widest opacity-85">
                  Einheit {unit.unitNumber}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-black/20">
                  {unit.subtitle}
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight">{unit.title}</h3>
              <p className="text-xs opacity-90 mt-1 line-clamp-1">{unit.description}</p>
            </div>

            {/* Vertical Skill Tree Nodes */}
            <div className="flex flex-col items-center space-y-6 pt-2">
              {unit.lessons.map((lesson, lessonIdx) => {
                const isCompleted = stats.completedLessonIds.includes(lesson.id);
                // First lesson is always unlocked, otherwise unlocked if previous is completed
                const isFirstLessonOverall = unitIdx === 0 && lessonIdx === 0;
                const prevLesson =
                  lessonIdx > 0
                    ? unit.lessons[lessonIdx - 1]
                    : unitIdx > 0
                    ? allUnits[unitIdx - 1].lessons[allUnits[unitIdx - 1].lessons.length - 1]
                    : null;
                const isUnlocked = isFirstLessonOverall || (prevLesson && stats.completedLessonIds.includes(prevLesson.id));
                const isCurrentActive = isUnlocked && !isCompleted;

                // Subtle zigzag offsets: -24px, 0px, 24px
                const offsets = ['translate-x-0', '-translate-x-6', 'translate-x-6'];
                const offsetClass = offsets[lessonIdx % offsets.length];

                return (
                  <div key={lesson.id} className={`flex flex-col items-center ${offsetClass}`}>
                    <button
                      disabled={!isUnlocked}
                      onClick={() => startLesson(lesson.id)}
                      className={`relative w-20 h-20 rounded-full flex items-center justify-center transition duration-200 active:scale-95 shadow-md ${
                        isCompleted
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'
                          : isCurrentActive
                          ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/40 ring-4 ring-red-400/30 animate-bounce-subtle'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-9 h-9 stroke-[3]" />
                      ) : isCurrentActive ? (
                        <Star className="w-9 h-9 fill-amber-300 text-amber-300" />
                      ) : (
                        <Lock className="w-8 h-8 opacity-70" />
                      )}

                      {/* Floating Start Tooltip on current active lesson */}
                      {isCurrentActive && (
                        <div className="absolute -top-3.5 bg-amber-400 text-slate-900 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                          Start
                        </div>
                      )}
                    </button>

                    {/* Lesson Label */}
                    <div className="text-center mt-2 max-w-[130px]">
                      <span className="text-xs font-bold text-slate-800 block leading-tight">
                        {lesson.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        +{lesson.xpReward} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
