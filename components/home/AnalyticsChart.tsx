import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Palette } from '../../constants/Styles';
import { styles } from './styles';
import { getRecentScores, DailyScore } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export function AnalyticsChart() {
  const { user } = useAuth();

  const [scores, setScores] = useState<DailyScore[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.userId) return;

    loadScores();
  }, [user?.userId]);

  const loadScores = async () => {
    if (!user?.userId) return;

    try {
      const data = await getRecentScores(user.userId, 7);

      // API returns newest first in many implementations.
      // Sort chronologically so the chart reads Mon -> Sun.
      const sortedData = [...data].sort((a, b) =>
        a.date.localeCompare(b.date)
      );

      setScores(sortedData);

      // Select the most recent day by default
      if (sortedData.length > 0) {
        setSelectedDay(sortedData[sortedData.length - 1].date);
      }
    } catch (error) {
      console.error('Failed to load strain-output balance scores:', error);
    }
  };

  const getDayLabel = (date: string) => {
    const parsedDate = new Date(`${date}T00:00:00`);

    return parsedDate.toLocaleDateString('en-US', {
      weekday: 'short',
    });
  };

  const getScoreNote = (score: number) => {
    if (score >= 80) {
      return 'Strong balance';
    }

    if (score >= 60) {
      return 'Good balance';
    }

    if (score >= 40) {
      return 'Moderate balance';
    }

    return 'Recovery may be needed';
  };

  const chartData = scores.map((score) => ({
    date: score.date,
    day: getDayLabel(score.date),
    value: score.strain_output_balance_score,
    note: getScoreNote(score.strain_output_balance_score),
  }));

  const activeItem = chartData.find(
    (item) => item.date === selectedDay
  );

  return (
    <View style={styles.analyticsCard}>
      {/* HEADER */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: '800',
          color: Palette.textPrimary,
        }}
      >
        Weekly Strain & Output Balance
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: Palette.textSecondary,
          marginTop: 2,
        }}
      >
        Tracks how well your physical output is balanced with recovery.
      </Text>

      {/* LEGEND */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: Palette.oceanBlue,
            }}
          />

          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: Palette.textSecondary,
            }}
          >
            Good Balance
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: Palette.crimson,
            }}
          />

          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: Palette.textSecondary,
            }}
          >
            Lower Balance
          </Text>
        </View>
      </View>

      {/* BAR CHART */}
      <View style={styles.chartContainer}>
        {chartData.map((item, index) => {
          const isSelected = item.date === selectedDay;

          const isLowBalance = item.value < 50;

          return (
            <TouchableOpacity
              key={`${item.date}-${index}`}
              style={styles.chartBarCol}
              onPress={() => setSelectedDay(item.date)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.barTrack,
                  isSelected && {
                    borderColor: Palette.textPrimary,
                    borderWidth: 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${Math.min(
                        Math.max(item.value, 0),
                        100
                      )}%`,
                      backgroundColor: isLowBalance
                        ? Palette.crimson
                        : Palette.oceanBlue,
                    },
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.chartLabel,
                  isSelected && {
                    color: Palette.textPrimary,
                    fontWeight: '800',
                  },
                ]}
              >
                {item.day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* DETAIL */}
      {activeItem && (
        <View
          style={{
            marginTop: 12,
            padding: 10,
            backgroundColor: Palette.creamLight,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: Palette.textPrimary,
            }}
          >
            {activeItem.day}: {activeItem.value}% Balance
          </Text>

          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: Palette.textSecondary,
            }}
          >
            {activeItem.note}
          </Text>
        </View>
      )}

      {/* NO DATA */}
      {scores.length === 0 && (
        <View
          style={{
            paddingVertical: 20,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: Palette.textSecondary,
            }}
          >
            No strain-output data available yet.
          </Text>
        </View>
      )}
    </View>
  );
}