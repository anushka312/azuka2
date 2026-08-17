import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Switch,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  Palette,
  GlobalStyles,
} from '../../constants/Styles';

import { styles } from './styles';

interface DailyGuidanceCardProps {
  isMinimumWin: boolean;
  onToggleMinimumWin: () => void;
}

export default function DailyGuidanceCard({
  isMinimumWin,
  onToggleMinimumWin,
}: DailyGuidanceCardProps) {

  return (
    <View
      style={[
        GlobalStyles.cardElevated,
        {
          padding: 15,
        },
      ]}
    >

      {/* ============================== */}
      {/* GUIDANCE MESSAGE */}
      {/* ============================== */}

      <View
        style={[
          styles.reframeHeader,
          {
            padding: 0,
            marginTop: 0,
          },
        ]}
      >

        <Ionicons
          name="flower-outline"
          size={16}
          color={Palette.orange}
        />

        <Text
          style={[
            GlobalStyles.badgeTextMuted,
            {
              fontSize: 14,
            },
          ]}
        >
          {isMinimumWin
            ? 'You have already shown up. Your body is doing profound internal work right now. Rest is your highest-leverage move today — biology agrees.'
            : 'Progesterone is peaking today, naturally shifting your body toward energy conservation. High load is expected — this is biology, not failure.'
          }
        </Text>

      </View>


      {/* ============================== */}
      {/* TODAY'S PATH */}
      {/* ============================== */}

      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.primaryPathBtn,
          {
            backgroundColor: isMinimumWin
              ? '#D97979'
              : Palette.forestGreen,

            padding: 10,
          },
        ]}
      >

        <View>

          <Text style={styles.pathLabel}>
            {isMinimumWin
              ? 'REST PATH'
              : "TODAY'S PATH"
            }
          </Text>

          <Text
            style={[
              GlobalStyles.brandSubtitle,
              {
                color: Palette.surfaceGreenMuted,
              },
            ]}
          >
            {isMinimumWin
              ? '10-min Breathe, Rest & Gentle Stretch'
              : '20-min Active Recovery & Mobility'
            }
          </Text>

        </View>

        <Ionicons
          name="play-circle"
          size={28}
          color={Palette.surfaceWhite}
          marginLeft = {-25}
        />

      </TouchableOpacity>


      {/* ============================== */}
      {/* MINIMUM WIN */}
      {/* ============================== */}

      <View style={styles.toggleRow}>

        <View style={{ flex: 1 }}>

          <Text
            style={[
              styles.toggleTitle,
              {
                color: Palette.skyBlue,
              },
            ]}
          >
            Minimum-Win Mode
          </Text>

          <Text style={GlobalStyles.captionText}>
            {isMinimumWin
              ? 'Active — intensity scaled to honour your rest'
              : 'Scales intensity & duration to match your energy'
            }
          </Text>

        </View>

        <Switch
          trackColor={{
            false: Palette.borderMuted,
            true: Palette.orange,
          }}
          thumbColor={Palette.surfaceWhite}
          onValueChange={onToggleMinimumWin}
          value={isMinimumWin}
        />

      </View>

    </View>
  );
}