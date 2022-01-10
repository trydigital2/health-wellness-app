import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { Header, Card, Button, StatBadge } from '@/components';
import { COLORS } from '@/constants/COLORS';
import { Workout, CompletedWorkoutSession } from '@/types/workout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addCompletedSession } from '@/redux/slices/workoutSlice';
import { recordCompletedWorkoutActivity } from '@/redux/slices/activitySlice';
import { storageService } from '@/services/storage';
import { formatDuration } from '@/utils/formatters';
import { calculateCaloriesBurned } from '@/utils/calculations';

interface WorkoutDetailScreenProps {
  route: { params: { workoutId: string } };
  navigation: any;
}

export const WorkoutDetailScreen: React.FC<WorkoutDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const { workoutId } = route.params;
  const workouts = useAppSelector((state) => state.workout.workouts);
  const workout: Workout | undefined = workouts.find((w) => w.id === workoutId);

  // Active workout session states
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercisesCount, setCompletedExercisesCount] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [summaryData, setSummaryData] = useState<CompletedWorkoutSession | null>(null);

  const timerRef = useRef<any>(null);

  // Timer interval handling
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused]);

  if (!workout) {
    return (
      <View style={styles.screen}>
        <Header title="Workout Not Found" onBack={() => navigation.goBack()} />
        <View style={styles.notFoundContent}>
          <Text style={styles.notFoundText}>This workout routine could not be located.</Text>
          <Button title="Return to Workouts" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const liveCalories = calculateCaloriesBurned(elapsedSeconds, workout.category, 70);

  const handleStartWorkout = () => {
    setIsActive(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    setCurrentExerciseIndex(0);
    setCompletedExercisesCount(0);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleNextExercise = () => {
    setCompletedExercisesCount((prev) => Math.min(workout.exercises.length, prev + 1));
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      handleFinishWorkout();
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
    }
  };

  const handleFinishWorkout = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);

    const sessionDuration = Math.max(1, elapsedSeconds);
    const sessionCalories = Math.max(15, liveCalories);

    const completedSession: CompletedWorkoutSession = {
      id: `session-${Date.now()}`,
      workoutId: workout.id,
      workoutTitle: workout.title,
      category: workout.category,
      startedAt: new Date(Date.now() - sessionDuration * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds: sessionDuration,
      caloriesBurned: sessionCalories,
      exercisesCompleted: Math.max(1, completedExercisesCount + 1),
      totalExercises: workout.exercises.length,
    };

    // Save to Redux and AsyncStorage
    dispatch(addCompletedSession(completedSession));
    dispatch(
      recordCompletedWorkoutActivity({
        durationSeconds: sessionDuration,
        caloriesBurned: sessionCalories,
      })
    );
    await storageService.addCompletedWorkout(completedSession);

    setSummaryData(completedSession);
    setShowCompletionModal(true);
  };

  return (
    <View style={styles.screen}>
      <Header
        title={isActive ? 'Session Active' : workout.title}
        subtitle={isActive ? `Exercise ${currentExerciseIndex + 1}/${workout.exercises.length}` : workout.category}
        onBack={() => {
          if (isActive) {
            Alert.alert(
              'End Workout?',
              'Do you want to end this active session?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'End Session', style: 'destructive', onPress: () => navigation.goBack() },
              ]
            );
          } else {
            navigation.goBack();
          }
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* ACTIVE SESSION CONTROLS PANEL */}
        {isActive ? (
          <Card style={styles.activeSessionCard}>
            <View style={styles.timerHeader}>
              <Text style={styles.timerTitle}>Active Duration</Text>
              <Text style={styles.timerDigits}>{formatDuration(elapsedSeconds)}</Text>
              <Text style={styles.timerBurned}>🔥 {liveCalories} kcal burned</Text>
            </View>

            {/* Current Exercise Detail */}
            <View style={styles.currentExBox}>
              <Text style={styles.currentExStep}>
                Step {currentExerciseIndex + 1} of {workout.exercises.length}
              </Text>
              <Text style={styles.currentExName}>{currentExercise.name}</Text>
              <Text style={styles.currentExMuscle}>Target: {currentExercise.targetMuscle}</Text>
              <Text style={styles.currentExInstruction}>{currentExercise.instruction}</Text>
            </View>

            {/* Interactive Session Buttons */}
            <View style={styles.sessionControlsRow}>
              <Button
                title={isPaused ? '▶ Resume' : '⏸ Pause'}
                variant={isPaused ? 'primary' : 'secondary'}
                onPress={handlePauseResume}
                style={styles.flexBtn}
              />
              <Button
                title={currentExerciseIndex === workout.exercises.length - 1 ? 'Finish' : 'Next Step ›'}
                variant="primary"
                onPress={handleNextExercise}
                style={styles.flexBtn}
              />
            </View>

            <View style={styles.subControlRow}>
              {currentExerciseIndex > 0 && (
                <Button
                  title="‹ Previous Step"
                  variant="ghost"
                  size="sm"
                  onPress={handlePrevExercise}
                />
              )}
              <Button
                title="Finish Workout Early"
                variant="danger"
                size="sm"
                onPress={handleFinishWorkout}
                style={{ marginLeft: 'auto' }}
              />
            </View>
          </Card>
        ) : (
          /* WORKOUT OVERVIEW BEFORE STARTING */
          <>
            <Card style={styles.overviewCard}>
              <View style={styles.tagRow}>
                <StatBadge label={workout.category} variant={workout.category.toLowerCase() as any} />
                <StatBadge label={workout.difficulty} variant="primary" />
              </View>

              <Text style={styles.detailTitle}>{workout.title}</Text>
              <Text style={styles.detailDesc}>{workout.description}</Text>

              <View style={styles.metricsSummary}>
                <View style={styles.summaryBox}>
                  <Text style={styles.sumVal}>{workout.durationMinutes} min</Text>
                  <Text style={styles.sumLabel}>Duration</Text>
                </View>
                <View style={styles.summaryBox}>
                  <Text style={styles.sumVal}>{workout.estimatedCalories} kcal</Text>
                  <Text style={styles.sumLabel}>Est. Burn</Text>
                </View>
                <View style={styles.summaryBox}>
                  <Text style={styles.sumVal}>{workout.exercises.length}</Text>
                  <Text style={styles.sumLabel}>Exercises</Text>
                </View>
              </View>

              <Button
                title="🚀 Start This Workout"
                variant="primary"
                size="lg"
                onPress={handleStartWorkout}
                style={styles.startBtn}
              />
            </Card>

            {/* Exercise Routine Breakdown */}
            <Text style={styles.sectionHeader}>Exercise Routine</Text>
            {workout.exercises.map((ex, idx) => (
              <Card key={ex.id} style={styles.exCard}>
                <View style={styles.exNumberCircle}>
                  <Text style={styles.exNumText}>{idx + 1}</Text>
                </View>
                <View style={styles.exInfo}>
                  <Text style={styles.exTitle}>{ex.name}</Text>
                  <Text style={styles.exMuscle}>Target: {ex.targetMuscle}</Text>
                  <Text style={styles.exDesc}>{ex.instruction}</Text>
                  {ex.durationSeconds ? (
                    <Text style={styles.exMeta}>⏱️ Duration: {ex.durationSeconds}s</Text>
                  ) : (
                    <Text style={styles.exMeta}>🔁 {ex.sets ?? 3} sets × {ex.reps ?? 12} reps</Text>
                  )}
                </View>
              </Card>
            ))}
          </>
        )}
      </ScrollView>

      {/* Completion Modal */}
      <Modal visible={showCompletionModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalTitle}>Outstanding Effort!</Text>
            <Text style={styles.modalSubtitle}>You completed {summaryData?.workoutTitle}</Text>

            <View style={styles.modalStatsCard}>
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatVal}>{formatDuration(summaryData?.durationSeconds ?? 0)}</Text>
                <Text style={styles.modalStatLbl}>Total Time</Text>
              </View>
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatVal}>{summaryData?.caloriesBurned} kcal</Text>
                <Text style={styles.modalStatLbl}>Calories</Text>
              </View>
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatVal}>{summaryData?.exercisesCompleted}</Text>
                <Text style={styles.modalStatLbl}>Exercises</Text>
              </View>
            </View>

            <Button
              title="Return to Workouts"
              onPress={() => {
                setShowCompletionModal(false);
                navigation.navigate('Workouts');
              }}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  notFoundContent: {
    padding: 30,
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  overviewCard: {
    padding: 20,
    marginBottom: 24,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  detailDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  metricsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 20,
  },
  summaryBox: {
    alignItems: 'center',
  },
  sumVal: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sumLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  startBtn: {
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  exCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  exNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  exNumText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  exInfo: {
    flex: 1,
  },
  exTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  exMuscle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 6,
  },
  exDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  exMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  activeSessionCard: {
    padding: 20,
    marginBottom: 20,
  },
  timerHeader: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  timerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timerDigits: {
    fontSize: 44,
    fontWeight: '800',
    color: COLORS.primary,
    marginVertical: 4,
    fontVariant: ['tabular-nums'],
  },
  timerBurned: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.calories,
  },
  currentExBox: {
    marginVertical: 18,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 14,
    padding: 16,
  },
  currentExStep: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  currentExName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  currentExMuscle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  currentExInstruction: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  sessionControlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  flexBtn: {
    flex: 1,
  },
  subControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 26,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalEmoji: {
    fontSize: 54,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalStatsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 24,
  },
  modalStatItem: {
    alignItems: 'center',
  },
  modalStatVal: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalStatLbl: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  modalButton: {
    width: '100%',
  },
});

export default WorkoutDetailScreen;
