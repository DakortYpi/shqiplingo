'use client';

import React from 'react';
import { AppProvider, useApp } from '../context/AppContext';
import { MobileContainer } from '../components/layout/MobileContainer';
import { TopHeader } from '../components/layout/TopHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { LearningPath } from '../components/learning/LearningPath';
import { ReviewTab } from '../components/review/ReviewTab';
import { TutorTab } from '../components/tutor/TutorTab';
import { ProfileTab } from '../components/profile/ProfileTab';
import { LessonModal } from '../components/learning/LessonModal';
import { getLessonById } from '../data/lessons';

function AppContent() {
  const { activeTab, activeLessonId, closeLesson } = useApp();

  const currentActiveLesson = activeLessonId ? getLessonById(activeLessonId) : null;

  return (
    <MobileContainer>
      {/* Sticky Top Status Bar */}
      <TopHeader />

      {/* Main Tab Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'lernen' && <LearningPath />}
        {activeTab === 'wiederholen' && <ReviewTab />}
        {activeTab === 'ki-tutor' && <TutorTab />}
        {activeTab === 'profil' && <ProfileTab />}
      </main>

      {/* Sticky Bottom Navigation */}
      <BottomNav />

      {/* Active Lesson Modal */}
      {currentActiveLesson && (
        <LessonModal lesson={currentActiveLesson} onClose={closeLesson} />
      )}
    </MobileContainer>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
