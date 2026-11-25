'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserStats, ReviewCard } from '../types';
import { soundManager } from '../utils/audio';

export type TabType = 'lernen' | 'wiederholen' | 'ki-tutor' | 'spiele' | 'profil';

interface AppContextType {
  stats: UserStats;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  addXp: (amount: number) => void;
  loseHeart: () => boolean;
  refillHearts: () => void;
  completeLesson: (lessonId: string, xpReward: number) => void;
  addMistakeCard: (card: Omit<ReviewCard, 'id' | 'addedAt' | 'timesWrong' | 'learned'>) => void;
  toggleCardLearned: (cardId: string) => void;
  toggleSound: () => void;
  activeLessonId: string | null;
  startLesson: (lessonId: string) => void;
  closeLesson: () => void;
}

const STORAGE_KEY = 'shqiplingo_user_stats';

const initialStats: UserStats = {
  xp: 45,
  streak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  hearts: 5,
  maxHearts: 5,
  lastHeartLostTimestamp: null,
  completedLessonIds: [],
  reviewCards: [
    {
      id: 'init-1',
      sq: 'Përshëndetje',
      de: 'Hallo / Guten Tag',
      grammarNote: 'Universelle Grußformel',
      exampleSq: 'Përshëndetje! Si jeni?',
      exampleDe: 'Hallo! Wie geht es Ihnen?',
      timesWrong: 1,
      learned: false,
      addedAt: Date.now() - 3600000,
    },
    {
      id: 'init-2',
      sq: 'Faleminderit',
      de: 'Danke',
      grammarNote: 'Ausdruck des Dankes ("falem nderit")',
      exampleSq: 'Faleminderit shumë!',
      exampleDe: 'Vielen Dank!',
      timesWrong: 1,
      learned: false,
      addedAt: Date.now() - 7200000,
    },
  ],
  soundEnabled: true,
  dailyGoalXp: 50,
  todayXp: 20,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<UserStats>(initialStats);
  const [activeTab, setActiveTab] = useState<TabType>('lernen');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setStats(parsed);
      }
    } catch {
      // Ignore parse errors
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
      } catch {
        // Storage quota catch
      }
    }
  }, [stats, isHydrated]);

  const addXp = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      xp: prev.xp + amount,
      todayXp: prev.todayXp + amount,
    }));
  };

  const loseHeart = (): boolean => {
    let hasRemaining = true;
    setStats((prev) => {
      const nextHearts = Math.max(0, prev.hearts - 1);
      hasRemaining = nextHearts > 0;
      return {
        ...prev,
        hearts: nextHearts,
        lastHeartLostTimestamp: Date.now(),
      };
    });
    return hasRemaining;
  };

  const refillHearts = () => {
    setStats((prev) => ({ ...prev, hearts: prev.maxHearts, lastHeartLostTimestamp: null }));
  };

  const completeLesson = (lessonId: string, xpReward: number) => {
    setStats((prev) => {
      const isFirstTime = !prev.completedLessonIds.includes(lessonId);
      return {
        ...prev,
        xp: prev.xp + xpReward,
        todayXp: prev.todayXp + xpReward,
        completedLessonIds: isFirstTime ? [...prev.completedLessonIds, lessonId] : prev.completedLessonIds,
      };
    });
  };

  const addMistakeCard = (cardData: Omit<ReviewCard, 'id' | 'addedAt' | 'timesWrong' | 'learned'>) => {
    setStats((prev) => {
      const existing = prev.reviewCards.find((c) => c.sq.toLowerCase() === cardData.sq.toLowerCase());
      if (existing) {
        return {
          ...prev,
          reviewCards: prev.reviewCards.map((c) =>
            c.id === existing.id ? { ...c, timesWrong: c.timesWrong + 1, learned: false } : c
          ),
        };
      }
      const newCard: ReviewCard = {
        ...cardData,
        id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        addedAt: Date.now(),
        timesWrong: 1,
        learned: false,
      };
      return { ...prev, reviewCards: [newCard, ...prev.reviewCards] };
    });
  };

  const toggleCardLearned = (cardId: string) => {
    setStats((prev) => ({
      ...prev,
      reviewCards: prev.reviewCards.map((c) => (c.id === cardId ? { ...c, learned: !c.learned } : c)),
    }));
  };

  const toggleSound = () => {
    setStats((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const startLesson = (lessonId: string) => setActiveLessonId(lessonId);
  const closeLesson = () => setActiveLessonId(null);

  return (
    <AppContext.Provider
      value={{
        stats,
        activeTab,
        setActiveTab,
        addXp,
        loseHeart,
        refillHearts,
        completeLesson,
        addMistakeCard,
        toggleCardLearned,
        toggleSound,
        activeLessonId,
        startLesson,
        closeLesson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
