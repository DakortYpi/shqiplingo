'use client';

import React from 'react';
import { HelpCircle, X, Lightbulb, BookOpen } from 'lucide-react';
import { WhyExplanation } from '../../types';

interface GrammarWhyModalProps {
  explanation: WhyExplanation;
  onClose: () => void;
}

export function GrammarWhyModal({ explanation, onClose }: GrammarWhyModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center space-x-2 text-red-600 font-bold">
            <HelpCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg text-slate-900">{explanation.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rule Summary */}
        <div className="bg-red-50/70 border border-red-100 rounded-2xl p-4 mb-4 text-sm text-slate-800 leading-relaxed font-medium">
          {explanation.ruleSummary}
        </div>

        {/* Deep details */}
        <div className="space-y-3 text-sm text-slate-600 mb-5">
          <p className="leading-relaxed">{explanation.details}</p>

          {explanation.germanComparison && (
            <div className="flex items-start space-x-2.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-800">Vergleich zum Deutschen:</span>
                {explanation.germanComparison}
              </div>
            </div>
          )}

          {/* Example Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-red-500" />
              <span>Beispiel</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{explanation.exampleSq}</p>
            <p className="text-xs text-slate-500 italic">{explanation.exampleDe}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-2xl transition shadow-md shadow-red-500/20"
        >
          Verstanden!
        </button>
      </div>
    </div>
  );
}
