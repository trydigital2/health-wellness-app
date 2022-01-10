import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
import { Card, InputField, StatBadge, Button } from '@/components';
import { COLORS } from '@/constants/COLORS';
import { Workout, WorkoutCategory } from '@/types/workout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCategory, setSearchQuery } from '@/redux/slices/workoutSlice';
import { formatDuration, formatDateShort } from '@/utils/formatters';

interface WorkoutsScreenProps {
  navigation: any;
}

const CATEGORIES: WorkoutCategory[] = [
  'All',
  'Cardio',
  'Strength',
  'HIIT',
  'Flexibility',
  'Mindfulness',
];

export const WorkoutsScreen: React.FC<WorkoutsScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const workouts = useAppSelector((state) => state.workout.workouts);
  const history = useAppSelector((state) => state.workout.history);
  const selectedCategory = useAppSelector((state) => state.workout.selectedCategory);
  const searchQuery = useAppSelector((state) => state.workout.searchQuery);

  const [activeTab, setActiveTab] = useState<'catalog' | 'history'>('catalog');

  // Filter workouts by category & search term
  const filteredWorkouts = workouts.filter((w) => {
    const matchCat = selectedCategory === 'All' || w.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const renderWorkoutCard = ({ item }: { item: Workout }) => {
    return (
      <Card
        style={styles.workoutCard}
        onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item.id })}>
        <View style={styles.cardTopRow}>
          <StatBadge label={item.category} variant={item.category.toLowerCase() as any} />
          <StatBadge label={item.difficulty} size="sm" variant="primary" />
        </View>

        <Text style={styles.workoutTitle}>{item.title}</Text>
        <Text style={styles.workoutDesc} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooterRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⏱️</Text>
            <Text style={styles.metaText}>{item.durationMinutes} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🔥</Text>
            <Text style={styles.metaText}>{item.estimatedCalories} kcal</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📋</Text>
            <Text style={styles.metaText}>{item.exercisesCount} exercises</Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.screen}>
      {/* Top Segment: Catalog vs History */}
      <View style={styles.segmentContainer}>
        <Pressable
          style={[styles.segmentBtn, activeTab === 'catalog' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('catalog')}>
          <Text style={[styles.segmentText, activeTab === 'catalog' && styles.segmentTextActive]}>
            Explore Workouts
          </Text>
        </Pressable>
        <Pressable
          style={[styles.segmentBtn, activeTab === 'history' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('history')}>
          <Text style={[styles.segmentText, activeTab === 'history' && styles.segmentTextActive]}>
            History ({history.length})
          </Text>
        </Pressable>
      </View>

      {activeTab === 'catalog' ? (
        <>
          {/* Search Bar */}
          <View style={styles.searchWrapper}>
            <InputField
              placeholder="Search exercises, yoga, HIIT..."
              value={searchQuery}
              onChangeText={(txt) => dispatch(setSearchQuery(txt))}
              containerStyle={styles.searchInput}
            />
          </View>

          {/* Category Chips Scroll */}
          <View style={styles.categoriesWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => dispatch(setCategory(cat))}
                    style={[styles.chip, isSelected && styles.chipActive]}>
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Workouts List */}
          <FlatList
            data={filteredWorkouts}
            keyExtractor={(item) => item.id}
            renderItem={renderWorkoutCard}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={styles.emptyTitle}>No workouts found</Text>
                <Text style={styles.emptySub}>Try searching for another keyword or category.</Text>
              </View>
            }
          />
        </>
      ) : (
        /* Workout History List */
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card style={styles.historyCard}>
              <View style={styles.historyTopRow}>
                <Text style={styles.historyTitle}>{item.workoutTitle}</Text>
                <StatBadge label={item.category} size="sm" variant={item.category.toLowerCase() as any} />
              </View>
              <Text style={styles.historyDate}>{formatDateShort(item.completedAt)}</Text>
              <View style={styles.historyMetricsRow}>
                <Text style={styles.historyMetricText}>
                  ⏱️ {formatDuration(item.durationSeconds)}
                </Text>
                <Text style={styles.historyMetricText}>
                  🔥 {item.caloriesBurned} kcal
                </Text>
                <Text style={styles.historyMetricText}>
                  ✅ {item.exercisesCompleted}/{item.totalExercises} exercises
                </Text>
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🏃‍♂️</Text>
              <Text style={styles.emptyTitle}>No workouts completed yet</Text>
              <Text style={styles.emptySub}>Start a session from the catalog to build your streak!</Text>
              <Button
                title="Explore Workouts"
                onPress={() => setActiveTab('catalog')}
                style={{ marginTop: 16 }}
              />
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  segmentContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 10,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 12,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  searchWrapper: {
    paddingHorizontal: 20,
    marginTop: 6,
  },
  searchInput: {
    marginBottom: 10,
  },
  categoriesWrapper: {
    marginBottom: 12,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 14,
  },
  workoutCard: {
    padding: 18,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  workoutDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaIcon: {
    fontSize: 14,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  historyCard: {
    padding: 16,
  },
  historyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  historyDate: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  historyMetricsRow: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 10,
  },
  historyMetricText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default WorkoutsScreen;
