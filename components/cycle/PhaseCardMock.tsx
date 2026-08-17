import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import PhaseCard from './PhaseCard';

export default function PhaseCardMock() {
  const mockDates = [
    {
      date: '2026-02-02',
      label: 'Menstrual',
    },
    {
      date: '2026-02-08',
      label: 'Follicular',
    },
    {
      date: '2026-02-16',
      label: 'Ovulation',
    },
    {
      date: '2026-02-22',
      label: 'Luteal',
    },
    {
      date: '2026-02-28',
      label: 'Late Luteal',
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        gap: 24,
      }}
    >
      {mockDates.map((item) => (
        <View key={item.date}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              marginBottom: 8,
            }}
          >
            {item.label}
          </Text>

          <PhaseCard selectedDate={item.date} />
        </View>
      ))}
    </ScrollView>
  );
}