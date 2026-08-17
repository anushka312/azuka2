import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Palette, GlobalStyles } from '../../constants/Styles';
import { styles } from './styles';

interface BiologicalIntelligenceProps {
  expanded: boolean;
  onToggle: () => void;
}

export default function BiologicalIntelligence({
  expanded,
  onToggle,
}: BiologicalIntelligenceProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onToggle}
      style={GlobalStyles.cardElevated}
    >
      <View style={styles.mindsetHeader}>
        <View>
          <Text
            style={[
              GlobalStyles.captionText,
              {
                color: Palette.crimson,
                fontWeight: '700',
              },
            ]}
          >
            BIOLOGICAL INTELLIGENCE
          </Text>

          <Text style={GlobalStyles.headingMedium}>
            Why You Feel This Way
          </Text>

          <Text style={GlobalStyles.captionText}>
            Water retention • Sleep quality • Energy dip
          </Text>
        </View>

        <View style={styles.expandIcon}>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={Palette.crimson}
          />
        </View>
      </View>

      {expanded && (
        <View style={styles.mindsetContent}>
          <View style={styles.mindsetItem}>
            <View style={styles.verticalLine} />

            <View style={{ flex: 1 }}>
              <Text style={styles.mindsetItemTitle}>
                Why water retention spikes on Day 22
              </Text>

              <Text style={GlobalStyles.bodyText}>
                As progesterone peaks then drops sharply,
                your body increases aldosterone, causing
                sodium and water retention. Temporary —
                resolves within 48 hrs of menstruation
                starting.
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.mindsetItem,
              { marginTop: 16 },
            ]}
          >
            <View style={styles.verticalLine} />

            <View style={{ flex: 1 }}>
              <Text style={styles.mindsetItemTitle}>
                How cortisol impacts sleep in late luteal
              </Text>

              <Text style={GlobalStyles.bodyText}>
                Elevated evening cortisol competes with
                progesterone's sedative effect, reducing
                sleep depth. A magnesium glycinate
                supplement or 10-min wind-down can
                counteract this.
              </Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}