
import React, { useState } from 'react';

import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    Switch,
    Pressable,
    Modal,
    Alert,
} from 'react-native';

import { Stack, useRouter } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { useAzuka } from '@/contexts/AzukaContext';

import {
    ChevronLeft,
    ChevronRight,
    Activity,
    Bell,
    LogOut,
    Moon,
    Trash2,
    CheckCircle2,
    RefreshCw,
} from 'lucide-react-native';

import LottieView from 'lottie-react-native';

import { Palette, GlobalStyles } from '@/constants/Styles';

export default function SettingsScreen() {
    const router = useRouter();

    // ============================================================
    // AUTH
    // ============================================================

    const { signOut } = useAuth();

    // ============================================================
    // AZUKA CONTEXT
    // ============================================================

    const { userProfile } = useAzuka();

    // ============================================================
    // USER PROFILE
    // ============================================================

    const userName = userProfile?.name || 'User';

    const userEmail = userProfile?.email || 'No email available';

    // ============================================================
    // CYCLE INFORMATION
    // ============================================================

    const lastPeriodStartDate =
        userProfile?.general_state?.last_period_start_date;

    const averageCycleLength =
        userProfile?.general_state?.average_cycle_length || 28;

    const periodDuration =
        userProfile?.general_state?.period_duration || 5;

    // ============================================================
    // CALCULATE CURRENT CYCLE DAY
    // ============================================================

    const getCycleDay = (): number | null => {
        if (!lastPeriodStartDate) {
            return null;
        }

        // Parse YYYY-MM-DD safely
        const [year, month, day] =
            lastPeriodStartDate.split('-').map(Number);

        if (!year || !month || !day) {
            return null;
        }

        const startDate = new Date(
            year,
            month - 1,
            day
        );

        const today = new Date();

        // Remove time component
        today.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);

        const difference =
            today.getTime() - startDate.getTime();

        const daysSinceStart =
            Math.floor(
                difference /
                    (1000 * 60 * 60 * 24)
            );

        if (daysSinceStart < 0) {
            return null;
        }

        // Cycle day starts at 1
        const cycleDay =
            (daysSinceStart % averageCycleLength) + 1;

        return cycleDay;
    };

    const cycleDay = getCycleDay();

    // ============================================================
    // CALCULATE CURRENT PHASE
    // ============================================================

    const getCyclePhase = (
        day: number | null
    ): string => {
        if (!day) {
            return 'Cycle data unavailable';
        }

        // Period / Menstrual phase
        if (day <= periodDuration) {
            return 'Menstrual';
        }

        // Follicular phase
        // Approximation:
        // Period ends -> ovulation
        const ovulationDay =
            Math.round(averageCycleLength / 2);

        if (day < ovulationDay) {
            return 'Follicular';
        }

        // Ovulation
        if (
            day >= ovulationDay - 1 &&
            day <= ovulationDay + 1
        ) {
            return 'Ovulation';
        }

        // Luteal
        return 'Luteal';
    };

    const cyclePhase = getCyclePhase(cycleDay);

    // ============================================================
    // PREFERENCE TOGGLES
    // ============================================================

    const [hapticFeedback, setHapticFeedback] =
        useState(true);

    const [pushNotifications, setPushNotifications] =
        useState(true);

    // ============================================================
    // RECALIBRATION
    // ============================================================

    const [isRecalibrating, setIsRecalibrating] =
        useState(false);

    const [recalibrateMessage, setRecalibrateMessage] =
        useState('');

    // ============================================================
    // RECALIBRATION HANDLER
    // ============================================================

    const triggerRecalibration = (
        reason: string
    ) => {
        setRecalibrateMessage(reason);
        setIsRecalibrating(true);

        setTimeout(() => {
            setIsRecalibrating(false);
            router.replace('/(tabs)/home');
        }, 3200);
    };

    // ============================================================
    // DELETE ACCOUNT
    // ============================================================

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to permanently delete your account and clear all cycle data? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        // TODO:
                        // Implement Firebase + MongoDB account deletion.
                        router.replace('/');
                    },
                },
            ]
        );
    };

    // ============================================================
    // LOGOUT
    // ============================================================

    const handleLogout = async () => {
        try {
            await signOut();

            // DO NOT manually navigate here.
            //
            // AuthContext changes isAuthenticated -> false.
            // Your root _layout.tsx / AuthRedirect should then
            // automatically send the user to the login screen.
        } catch (error) {
            console.error(
                'Logout error:',
                error
            );

            Alert.alert(
                'Logout failed',
                'Unable to log out. Please try again.'
            );
        }
    };

    // ============================================================
    // AVATAR
    // ============================================================

    const avatarInitial =
        userName.charAt(0).toUpperCase();

    // ============================================================
    // UI
    // ============================================================

    return (
        <SafeAreaView
            style={GlobalStyles.screenContainer}
        >
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            {/* =====================================================
                TOP BAR
            ====================================================== */}

            <View style={styles.topBar}>
                <Pressable
                    onPress={() => router.back()}
                    style={styles.backButton}
                    hitSlop={10}
                >
                    <ChevronLeft
                        size={24}
                        color={Palette.textPrimary}
                    />
                </Pressable>

                <Text
                    style={
                        GlobalStyles.headingMedium
                    }
                >
                    Settings
                </Text>

                <View
                    style={{
                        width: 36,
                    }}
                />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    styles.scrollContent
                }
            >
                {/* =================================================
                    PROFILE & IDENTITY
                ================================================== */}

                <Text style={styles.sectionHeader}>
                    Profile & Identity
                </Text>

                <View
                    style={
                        GlobalStyles.cardElevated
                    }
                >
                    <View style={styles.profileRow}>
                        {/* Avatar */}

                        <View
                            style={
                                styles.avatarContainer
                            }
                        >
                            <View
                                style={
                                    styles.avatarPlaceholder
                                }
                            >
                                <Text
                                    style={
                                        styles.avatarText
                                    }
                                >
                                    {avatarInitial}
                                </Text>
                            </View>
                        </View>

                        {/* User Information */}

                        <View
                            style={{
                                flex: 1,
                                marginLeft: 14,
                            }}
                        >
                            <Text
                                style={
                                    styles.rowTitle
                                }
                            >
                                {userName}
                            </Text>

                            <Text
                                style={
                                    styles.rowSubtitle
                                }
                            >
                                {userEmail}
                            </Text>

                            {/* Cycle information */}

                            <Text
                                style={[
                                    styles.rowSubtitle,
                                    {
                                        marginTop: 6,
                                    },
                                ]}
                            >
                                {cycleDay
                                    ? `${cyclePhase} • Day ${cycleDay}` : 'Cycle information unavailable'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* =================================================
                    BIOLOGICAL ENGINE SETUP
                ================================================== */}

                <Text style={styles.sectionHeader}>
                    Biological Engine Setup
                </Text>

                <View
                    style={
                        GlobalStyles.cardElevated
                    }
                >
                    {/* Reconfigure Biology */}

                    <Pressable
                        style={styles.settingRow}
                        onPress={() =>
                            router.push(
                                '/reconfigure-biology'
                            )
                        }
                    >
                        <View
                            style={styles.rowLeft}
                        >
                            <View
                                style={[
                                    styles.iconWrapper,
                                    {
                                        backgroundColor:
                                            Palette.surfaceGreenMuted,
                                    },
                                ]}
                            >
                                <Activity
                                    size={20}
                                    color={
                                        Palette.forestGreen
                                    }
                                />
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={
                                        styles.rowTitle
                                    }
                                >
                                    Re-configure Biology
                                    & Goals
                                </Text>

                                <Text
                                    style={
                                        styles.rowSubtitle
                                    }
                                >
                                    Cycle, workout capacity,
                                    diet & friction points
                                </Text>
                            </View>
                        </View>

                        <ChevronRight
                            size={20}
                            color={
                                Palette.textSecondary
                            }
                        />
                    </Pressable>

                    <View
                        style={styles.divider}
                    />

                    {/* Force Recalibration */}

                    <Pressable
                        style={styles.settingRow}
                        onPress={() =>
                            triggerRecalibration(
                                'Manual trigger: Resyncing engine metrics to current day...'
                            )
                        }
                    >
                        <View
                            style={styles.rowLeft}
                        >
                            <View
                                style={[
                                    styles.iconWrapper,
                                    {
                                        backgroundColor:
                                            Palette.surfaceBlueMuted,
                                    },
                                ]}
                            >
                                <RefreshCw
                                    size={20}
                                    color={
                                        Palette.oceanBlue
                                    }
                                />
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={
                                        styles.rowTitle
                                    }
                                >
                                    Force Engine
                                    Recalibration
                                </Text>

                                <Text
                                    style={
                                        styles.rowSubtitle
                                    }
                                >
                                    Re-calculate daily
                                    adaptive rules now
                                </Text>
                            </View>
                        </View>

                        <ChevronRight
                            size={20}
                            color={
                                Palette.textSecondary
                            }
                        />
                    </Pressable>
                </View>

                {/* =================================================
                    PREFERENCES
                ================================================== */}

                <Text style={styles.sectionHeader}>
                    Preferences
                </Text>

                <View
                    style={
                        GlobalStyles.cardElevated
                    }
                >
                    {/* Push Notifications */}

                    <View
                        style={styles.settingRow}
                    >
                        <View
                            style={styles.rowLeft}
                        >
                            <View
                                style={[
                                    styles.iconWrapper,
                                    {
                                        backgroundColor:
                                            Palette.surfaceGreenMuted,
                                    },
                                ]}
                            >
                                <Bell
                                    size={20}
                                    color={
                                        Palette.forestGreen
                                    }
                                />
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={
                                        styles.rowTitle
                                    }
                                >
                                    Push Notifications
                                </Text>

                                <Text
                                    style={
                                        styles.rowSubtitle
                                    }
                                >
                                    Phase shift & recovery
                                    alerts
                                </Text>
                            </View>
                        </View>

                        <Switch
                            value={
                                pushNotifications
                            }
                            onValueChange={
                                setPushNotifications
                            }
                            trackColor={{
                                false:
                                    Palette.borderSubtle,
                                true:
                                    Palette.forestGreen,
                            }}
                        />
                    </View>

                    <View
                        style={styles.divider}
                    />

                    {/* Haptic Feedback */}

                    <View
                        style={styles.settingRow}
                    >
                        <View
                            style={styles.rowLeft}
                        >
                            <View
                                style={[
                                    styles.iconWrapper,
                                    {
                                        backgroundColor:
                                            Palette.surfaceBlueMuted,
                                    },
                                ]}
                            >
                                <Moon
                                    size={20}
                                    color={
                                        Palette.skyBlue
                                    }
                                />
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={
                                        styles.rowTitle
                                    }
                                >
                                    Haptic Feedback
                                </Text>

                                <Text
                                    style={
                                        styles.rowSubtitle
                                    }
                                >
                                    Tactile responses on
                                    interactive prompts
                                </Text>
                            </View>
                        </View>

                        <Switch
                            value={hapticFeedback}
                            onValueChange={
                                setHapticFeedback
                            }
                            trackColor={{
                                false:
                                    Palette.borderSubtle,
                                true:
                                    Palette.skyBlue,
                            }}
                        />
                    </View>
                </View>

                {/* =================================================
                    ACCOUNT ACTIONS
                ================================================== */}

                <Text style={styles.sectionHeader}>
                    Account Actions
                </Text>

                <View
                    style={{
                        gap: 10,
                        marginTop: 4,
                        marginBottom: 40,
                    }}
                >
                    {/* Logout */}

                    <Pressable
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <LogOut
                            size={18}
                            color={
                                Palette.textPrimary
                            }
                        />

                        <Text
                            style={
                                styles.logoutText
                            }
                        >
                            Log Out
                        </Text>
                    </Pressable>

                    {/* Delete Account */}

                    <Pressable
                        style={styles.deleteButton}
                        onPress={
                            handleDeleteAccount
                        }
                    >
                        <Trash2
                            size={18}
                            color={
                                Palette.crimson
                            }
                        />

                        <Text
                            style={
                                styles.deleteText
                            }
                        >
                            Delete Account
                        </Text>
                    </Pressable>

                    <Text
                        style={
                            styles.versionText
                        }
                    >
                        Azuka Core Engine v1.0.4
                        {' '}(
                        Build 42)
                    </Text>
                </View>
            </ScrollView>

            {/* =====================================================
                FULL PAGE RECALIBRATION
            ====================================================== */}

            <Modal
                visible={isRecalibrating}
                animationType="fade"
                statusBarTranslucent
            >
                <SafeAreaView
                    style={
                        styles.fullScreenContainer
                    }
                >
                    <View
                        style={
                            styles.fullScreenContent
                        }
                    >
                        <LottieView
                            source={{
                                uri: 'https://assets5.lottiefiles.com/packages/lf20_u4yrau.json',
                            }}
                            autoPlay
                            loop={false}
                            style={
                                styles.lottieAnimation
                            }
                        />

                        <View
                            style={
                                styles.badgeContainer
                            }
                        >
                            <CheckCircle2
                                size={32}
                                color={
                                    Palette.forestGreen
                                }
                            />
                        </View>

                        <Text
                            style={
                                styles.fullScreenTitle
                            }
                        >
                            Recalibrating Engine
                        </Text>

                        <Text
                            style={
                                styles.fullScreenSubtitle
                            }
                        >
                            {recalibrateMessage ||
                                'Aligning workouts, macros, and minimum-win targets...'}
                        </Text>

                        <Text
                            style={
                                styles.redirectingNotice
                            }
                        >
                            Redirecting to Dashboard...
                        </Text>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // ============================================================
    // TOP BAR
    // ============================================================

    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },

    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor:
            Palette.surfaceWhite,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor:
            Palette.borderSubtle,
    },

    // ============================================================
    // SCROLL
    // ============================================================

    scrollContent: {
        paddingVertical: 12,
    },

    // ============================================================
    // SECTION HEADER
    // ============================================================

    sectionHeader: {
        fontSize: 13,
        fontWeight: '800',
        color: Palette.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginTop: 18,
        marginBottom: 8,
        marginLeft: 4,
    },

    // ============================================================
    // PROFILE
    // ============================================================

    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
    },

    avatarContainer: {
        position: 'relative',
    },

    avatarPlaceholder: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor:
            Palette.oceanBlue,
        justifyContent: 'center',
        alignItems: 'center',
    },

    avatarText: {
        fontSize: 20,
        fontWeight: '800',
        color: Palette.surfaceWhite,
    },

    // ============================================================
    // SETTINGS ROWS
    // ============================================================

    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },

    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },

    iconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },

    rowTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Palette.textPrimary,
    },

    rowSubtitle: {
        fontSize: 12,
        fontWeight: '500',
        color: Palette.textSecondary,
        marginTop: 2,
    },

    divider: {
        height: 1,
        backgroundColor:
            Palette.borderSubtle,
        marginVertical: 4,
    },

    // ============================================================
    // ACCOUNT ACTIONS
    // ============================================================

    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor:
            Palette.surfaceWhite,
        borderWidth: 1,
        borderColor:
            Palette.borderSubtle,
    },

    logoutText: {
        fontSize: 15,
        fontWeight: '800',
        color: Palette.textPrimary,
    },

    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor:
            Palette.surfaceCrimsonMuted,
        borderWidth: 1,
        borderColor:
            Palette.crimson,
    },

    deleteText: {
        fontSize: 15,
        fontWeight: '800',
        color: Palette.crimson,
    },

    versionText: {
        textAlign: 'center',
        marginTop: 12,
        fontSize: 11,
        color: Palette.textSecondary,
        fontWeight: '600',
    },

    // ============================================================
    // RECALIBRATION SCREEN
    // ============================================================

    fullScreenContainer: {
        flex: 1,
        backgroundColor:
            Palette.surfaceWhite,
    },

    fullScreenContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 28,
    },

    lottieAnimation: {
        width: 240,
        height: 240,
    },

    badgeContainer: {
        marginTop: -20,
        marginBottom: 16,
    },

    fullScreenTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Palette.textPrimary,
        marginBottom: 10,
        textAlign: 'center',
    },

    fullScreenSubtitle: {
        fontSize: 15,
        color: Palette.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },

    redirectingNotice: {
        fontSize: 13,
        fontWeight: '700',
        color: Palette.forestGreen,
        letterSpacing: 0.5,
    },
});