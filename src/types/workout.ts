export type WorkoutCategory = 
  | 'All' 
  | 'Cardio' 
  | 'Strength' 
  | 'HIIT' 
  | 'Flexibility' 
  | 'Mindfulness';

export type WorkoutDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  sets?: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds: number;
  instruction: string;
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  category: Exclude<WorkoutCategory, 'All'>;
  difficulty: WorkoutDifficulty;
  durationMinutes: number;
  estimatedCalories: number;
  exercisesCount: number;
  color: string;
  iconName: string;
  exercises: Exercise[];
  tags: string[];
}

export interface CompletedWorkoutSession {
  id: string;
  workoutId: string;
  workoutTitle: string;
  category: Exclude<WorkoutCategory, 'All'>;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  caloriesBurned: number;
  exercisesCompleted: number;
  totalExercises: number;
  notes?: string;
}

export type WorkoutSessionStatus = 'idle' | 'active' | 'paused' | 'completed';
