import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Palette } from '../../constants/Styles';
import { styles } from './styles';

export function AnalyticsChart() {
  const [selectedDay, setSelectedDay] = useState<string | null>('Wed');

  const chartData = [
    { day: 'Mon', value: 40, highRisk: false, note: 'Moderate workload' },
    { day: 'Tue', value: 65, highRisk: false, note: 'Steady energy' },
    { day: 'Wed', value: 85, highRisk: true, note: 'High strain day' },
    { day: 'Thu', value: 50, highRisk: false, note: 'Balanced state' },
    { day: 'Fri', value: 75, highRisk: true, note: 'Heavy effort' },
    { day: 'Sat', value: 30, highRisk: false, note: 'Rest & active recovery' },
    { day: 'Sun', value: 45, highRisk: false, note: 'Light activity' },
  ];

  const activeItem = chartData.find((d) => d.day === selectedDay);

  return (
    <View style={styles.analyticsCard}>
      {/* HEADER WITH SIMPLE COPY */}
      <Text style={{ fontSize: 14, fontWeight: '800', color: Palette.textPrimary }}>
        Weekly Stress & Energy Trend
      </Text>
      <Text style={{ fontSize: 11, color: Palette.textSecondary, marginTop: 2 }}>
        Tracks daily nervous system strain based on your biometrics.
      </Text>

      {/* VISUAL LEGEND */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: Palette.oceanBlue,
            }}
          />
          <Text style={{ fontSize: 11, fontWeight: '600', color: Palette.textSecondary }}>
            Optimal Zone
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: Palette.crimson,
            }}
          />
          <Text style={{ fontSize: 11, fontWeight: '600', color: Palette.textSecondary }}>
            High Stress Spike
          </Text>
        </View>
      </View>

      {/* BAR CHART */}
      <View style={styles.chartContainer}>
        {chartData.map((item, index) => {
          const isSelected = item.day === selectedDay;

          return (
            <TouchableOpacity
              key={index}
              style={styles.chartBarCol}
              onPress={() => setSelectedDay(item.day)}
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
                      height: `${item.value}%`,
                      backgroundColor: item.highRisk
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

      {/* DYNAMIC TAP DETAIL CONTAINER */}
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
          <Text style={{ fontSize: 12, fontWeight: '700', color: Palette.textPrimary }}>
            {activeItem.day}: {activeItem.value}% Total Strain
          </Text>
          <Text style={{ fontSize: 11, fontWeight: '600', color: Palette.textSecondary }}>
            {activeItem.note}
          </Text>
        </View>
      )}
    </View>
  );
}