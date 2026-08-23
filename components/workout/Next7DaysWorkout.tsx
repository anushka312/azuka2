import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { GlobalStyles, Palette } from '@/constants/Styles';

// Helper to generate the next 7 rolling dates dynamically with recommended exercises
const getUpcomingWeek = () => {
  const daysList = [];
  const phaseMap = [
    { 
      phase: 'Luteal', 
      intensity: 'Light Flow', 
      color: Palette.orange, 
      duration: 20, 
      status: 'Adapted due to fatigue',
      exercises: ['Yin Yoga', 'Mobility', 'Walking'] 
    },
    { 
      phase: 'Luteal', 
      intensity: 'Stabilize', 
      color: Palette.orange, 
      duration: 30, 
      status: 'On Track',
      exercises: ['Pilates Core', 'Resistance Band'] 
    },
    { 
      phase: 'Menstrual', 
      intensity: 'Recovery', 
      color: Palette.crimson, 
      duration: 15, 
      status: 'Gentle Flow',
      exercises: ['Stretching', 'Deep Breathing', 'Light Walk'] 
    },
    { 
      phase: 'Menstrual', 
      intensity: 'Recovery', 
      color: Palette.crimson, 
      duration: 20, 
      status: 'On Track',
      exercises: ['Low-Impact', 'Posture Flow'] 
    },
    { 
      phase: 'Follicular', 
      intensity: 'Strength', 
      color: Palette.forestGreen, 
      duration: 40, 
      status: 'Energy Rising',
      exercises: ['Goblet Squats', 'RDLs', 'Push Press'] 
    },
    { 
      phase: 'Follicular', 
      intensity: 'Power', 
      color: Palette.forestGreen, 
      duration: 45, 
      status: 'Peak Force',
      exercises: ['Deadlifts', 'Kettlebell Swings', 'HIIT'] 
    },
    { 
      phase: 'Ovulatory', 
      intensity: 'High Power', 
      color: Palette.oceanBlue, 
      duration: 50, 
      status: 'Optimal',
      exercises: ['Heavy Strength', 'Plyometrics', 'Sprints'] 
    },
  ];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    
    const dayName = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    daysList.push({
      id: i,
      day: dayName,
      date: dateStr,
      ...phaseMap[i],
    });
  }
  return daysList;
};

export default function Next7DaysWorkout() {
  const weekPlan = getUpcomingWeek();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>7-Day Biological Outlook</Text>
      <Text style={styles.sectionSubtitle}>Dynamically adjusted to your cycle & stress load</Text>

      {weekPlan.map((item) => (
        <View
          key={`${item.day}-${item.date}`}
          style={[GlobalStyles.cardElevated, styles.cardWrapper]}
        >
          <View style={styles.weekRow}>
            {/* Date Column */}
            <View style={styles.dateColumn}>
              <Text style={styles.dayName}>{item.day}</Text>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>

            <View style={styles.verticalDivider} />

            {/* Phase, Status & Exercise List Info */}
            <View style={styles.weekInfo}>
              <View style={styles.phaseRow}>
                <Text style={styles.weekPhase}>{item.phase}</Text>
                <Text style={styles.statusBadge}>{item.status}</Text>
              </View>
              <Text style={styles.weekDuration}>Target: {item.duration} min</Text>
              
              {/* Recommended Exercises Pill List with proper margin handling */}
              <View style={styles.exerciseContainer}>
                {item.exercises.map((ex, idx) => (
                  <View key={idx} style={styles.exerciseTagWrapper}>
                    <Text style={styles.exerciseTag}>{ex}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Intensity Badge */}
            <View
              style={[
                styles.weekIntensity,
                { backgroundColor: item.color },
              ]}
            >
              <Text style={styles.weekIntensityText}>{item.intensity}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textPrimary || '#111',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary || '#666',
    marginBottom: 12,
  },
  cardWrapper: {
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  dateColumn: {
    width: 50,
  },
  dayName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#222',
  },
  dateText: {
    fontSize: 11,
    color: '#888',
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#eee',
    marginHorizontal: 12,
  },
  weekInfo: {
    flex: 1,
    paddingRight: 8,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  weekPhase: {
    fontWeight: '700',
    fontSize: 13,
    color: '#444',
  },
  statusBadge: {
    fontSize: 10,
    color: '#007AFF',
    backgroundColor: '#E5F1FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  weekDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  exerciseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    marginRight: -4, // Counteract right margin of last item in row
  },
  exerciseTagWrapper: {
    marginRight: 4,
    marginBottom: 4,
  },
  exerciseTag: {
    fontSize: 10,
    color: '#555',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    overflow: 'hidden',
  },
  weekIntensity: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  weekIntensityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});