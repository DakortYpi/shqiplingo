import { Unit, Lesson } from '../types';
import { unit1 } from './unit1';
import { unit2 } from './unit2';
import { unit3 } from './unit3';
import { unit4 } from './unit4';

export const allUnits: Unit[] = [unit1, unit2, unit3, unit4];

export function getAllLessons(): Lesson[] {
  return allUnits.flatMap((u) => u.lessons);
}

export function getLessonById(id: string): Lesson | undefined {
  return getAllLessons().find((l) => l.id === id);
}

export function getUnitById(id: string): Unit | undefined {
  return allUnits.find((u) => u.id === id);
}

export function getNextLessonId(currentLessonId: string): string | null {
  const lessons = getAllLessons();
  const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
  if (currentIndex >= 0 && currentIndex < lessons.length - 1) {
    return lessons[currentIndex + 1].id;
  }
  return null;
}
