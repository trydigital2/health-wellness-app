import { useState, useEffect, useMemo, useCallback } from 'react';
import { Workout, WorkoutCategory, CompletedWorkoutSession } from '@/types/workout';
import { MOCK_WORKOUTS } from '@/data/mockWorkouts';
import { storageService } from '@/services/storage';

export function useWorkouts() {
  const [workouts] = useState<Workout[]>(MOCK_WORKOUTS);
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [history, setHistory] = useState<CompletedWorkoutSession[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);

  const loadHistory = useCallback(async () => {
    try {
      setIsLoadingHistory(true);
      const data = await storageService.getWorkoutHistory();
      setHistory(data);
    } catch (e) {
      console.warn('[useWorkouts] Failed to load history:', e);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const filteredWorkouts = useMemo(() => {
    return workouts.filter((workout) => {
      const matchesCategory =
        selectedCategory === 'All' || workout.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesQuery;
    });
  }, [workouts, selectedCategory, searchQuery]);

  const getWorkoutById = useCallback(
    (id: string): Workout | undefined => {
      return workouts.find((w) => w.id === id);
    },
    [workouts]
  );

  const saveCompletedWorkout = useCallback(
    async (session: CompletedWorkoutSession) => {
      const updatedHistory = await storageService.addCompletedWorkout(session);
      setHistory(updatedHistory);
      // Also update today's active metrics in storage
      await storageService.recordWorkoutActivity(session.durationSeconds, session.caloriesBurned);
    },
    []
  );

  return {
    workouts,
    filteredWorkouts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    history,
    isLoadingHistory,
    getWorkoutById,
    saveCompletedWorkout,
    refreshHistory: loadHistory,
  };
}
