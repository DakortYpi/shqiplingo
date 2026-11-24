'use client';

import React, { useState } from 'react';
import { Send, Volume2, Sparkles, MessageSquare, Info } from 'lucide-react';
import { tutorScenarios } from '../../data/scenarios';
import { getTutorReply } from '../../utils/tutor';
import { soundManager } from '../../utils/audio';
import { ChatMessage } from '../../types';

export function TutorTab() {
  const [activeScenarioId, setActiveScenarioId] = useState(tutorScenarios[0].id);
  const currentScenario = tutorScenarios.find((s) => s.id === activeScenarioId) || tutorScenarios[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: currentScenario.initialMessage.content,
      translationDe: currentScenario.initialMessage.translationDe,
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslations, setShowTranslations] = useState(true);

  const handleScenarioChange = (id: string) => {
    setActiveScenarioId(id);
    const scen = tutorScenarios.find((s) => s.id === id) || tutorScenarios[0];
    setMessages([
      {
        id: `scen-${Date.now()}`,
        role: 'assistant',
        content: scen.initialMessage.content,
        translationDe: scen.initialMessage.translationDe,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Simulate realistic conversational thinking delay
      await new Promise((resolve) => setTimeout(resolve, 400));
      const data = getTutorReply(activeScenarioId, text);
      const botMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        translationDe: data.translationDe,
        grammarFeedback: data.grammarFeedback,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
      soundManager.speakAlbanian(data.content);
    } catch {
      // Offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50 pb-20 select-none">
      {/* Scenario Selector & Header */}
      <div className="p-3 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-black text-slate-900 text-base flex items-center space-x-1.5">
            <span>KI-Tutor: {currentScenario.role}</span>
          </h2>
          <button
            onClick={() => setShowTranslations(!showTranslations)}
            className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full"
          >
            {showTranslations ? 'Übersetzung an' : 'Nur Albanisch'}
          </button>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {tutorScenarios.map((scen) => (
            <button
              key={scen.id}
              onClick={() => handleScenarioChange(scen.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center space-x-1.5 ${
                activeScenarioId === scen.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{scen.avatar}</span>
              <span>{scen.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'bg-red-600 text-white rounded-br-2xs shadow-xs font-medium'
                  : 'bg-white border border-slate-200 text-slate-900 rounded-bl-2xs shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between space-x-2">
                <p className="font-semibold text-base leading-snug">{msg.content}</p>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => soundManager.speakAlbanian(msg.content)}
                    className="p-1 text-slate-400 hover:text-red-600 shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {msg.role === 'assistant' && showTranslations && msg.translationDe && (
                <p className="text-xs text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100 italic">
                  {msg.translationDe}
                </p>
              )}

              {msg.grammarFeedback && (
                <div className="mt-2 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] p-2 rounded-xl flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{msg.grammarFeedback}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs italic p-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span>Tutor antwortet auf Albanisch...</span>
          </div>
        )}
      </div>

      {/* Suggested Chips & Input Bar */}
      <div className="bg-white border-t border-slate-200 p-3 space-y-2">
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {currentScenario.suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-lg text-xs whitespace-nowrap font-semibold border border-slate-200 transition"
            >
              {prompt}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Schreibe auf Albanisch..."
            className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white rounded-xl transition shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
