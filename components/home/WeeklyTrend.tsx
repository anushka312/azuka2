import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Palette, GlobalStyles } from '../../constants/Styles';
import { styles } from './styles';

export default function WeeklyTrend() {
  return (
    <View style={GlobalStyles.cardElevated}>

      {/* Header */}
      <View style={styles.trendHeader}>
        <View>
          <Text
            style={[
              GlobalStyles.captionText,
              { fontWeight: '700' },
            ]}
          >
            WEEKLY TREND
          </Text>

          <Text style={GlobalStyles.headingMedium}>
            Adaptability & Consistency
          </Text>

          <Text style={GlobalStyles.captionText}>
            Fatigue - HRV overlay — Luteal phase
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={GlobalStyles.headingMedium}>
            4/4
          </Text>

          <Text style={GlobalStyles.captionText}>
            Days Adapted
          </Text>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.mockChartArea}>
        <Svg
          height="60"
          width="100%"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          {/* Energy */}
          <Circle
            cx="10"
            cy="50"
            r="3"
            fill={Palette.oceanBlue}
          />

          <Circle
            cx="30"
            cy="45"
            r="3"
            fill={Palette.oceanBlue}
          />

          <Circle
            cx="50"
            cy="40"
            r="3"
            fill={Palette.oceanBlue}
          />

          <Circle
            cx="70"
            cy="55"
            r="3"
            fill={Palette.oceanBlue}
          />

          <Circle
            cx="90"
            cy="60"
            r="3"
            fill={Palette.oceanBlue}
          />

          {/* HRV */}
          <Circle
            cx="10"
            cy="70"
            r="3"
            fill={Palette.textMuted}
          />

          <Circle
            cx="30"
            cy="65"
            r="3"
            fill={Palette.textMuted}
          />

          <Circle
            cx="50"
            cy="65"
            r="3"
            fill={Palette.textMuted}
          />

          <Circle
            cx="70"
            cy="70"
            r="3"
            fill={Palette.textMuted}
          />

          <Circle
            cx="90"
            cy="75"
            r="3"
            fill={Palette.textMuted}
          />
        </Svg>
      </View>

      {/* Legend */}
      <View style={styles.chartLegend}>
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
          }}
        >
          <Text style={GlobalStyles.captionText}>
            ▬ Energy
          </Text>

          <Text style={GlobalStyles.captionText}>
            - - - HRV
          </Text>
        </View>

        <Text
          style={[
            GlobalStyles.captionText,
            {
              color: Palette.forestGreen,
            },
          ]}
        >
          ✓ 4 days adapted successfully
        </Text>
      </View>

    </View>
  );
}