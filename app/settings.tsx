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
    TextInput,
    Image,
    Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import {
    ChevronLeft,
    ChevronRight,
    Activity,
    Bell,
    LogOut,
    Moon,
    Trash2,
    Camera,
    CheckCircle2,
    Edit3,
    RefreshCw,
} from 'lucide-react-native';
import LottieView from 'lottie-react-native';

import { Palette, GlobalStyles } from '@/constants/Styles';

export default function SettingsScreen() {
    const router = useRouter();

    // Profile Edit State (Saves locally with zero recalibration)
    const [userName, setUserName] = useState('Anushka');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

    // Preference Toggle States
    const [hapticFeedback, setHapticFeedback] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);

    // Recalibration Full Screen Flow State
    const [isRecalibrating, setIsRecalibrating] = useState(false);
    const [recalibrateMessage, setRecalibrateMessage] = useState('');

    // 1. Photo Picker (No Recalibration Triggered)
    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert(
                'Permission Required',
                'Permission to access your photo gallery is required to select a profile picture.'
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setProfileImage(result.assets[0].uri);
        }
    };

    // Direct Save for Profile Info (Immediate update)
    const handleSaveProfile = () => {
        setIsEditProfileModalOpen(false);
    };

    // 2. Biological Engine Recalibration Handler
    const triggerRecalibration = (reason: string) => {
        setRecalibrateMessage(reason);
        setIsRecalibrating(true);

        // After animation delay, redirect to dashboard
        setTimeout(() => {
            setIsRecalibrating(false);
            router.replace('/(tabs)/home');
        }, 3200);
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to permanently delete your account and clear all cycle data? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        router.replace('/');
                    },
                },
            ]
        );
    };

    //log out button
    const { signOut } = useAuth();

        const handleLogout = async () => {
        await signOut();
        router.replace('/');
        };

    return (
        <SafeAreaView style={GlobalStyles.screenContainer}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* TOP BAR */}
            <View style={styles.topBar}>
                <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
                    <ChevronLeft size={24} color={Palette.textPrimary} />
                </Pressable>
                <Text style={GlobalStyles.headingMedium}>Settings</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* PROFILE & IDENTITY SECTION */}
                <Text style={styles.sectionHeader}>Profile & Identity</Text>
                <View style={GlobalStyles.cardElevated}>
                    <View style={styles.profileRow}>
                        <Pressable style={styles.avatarContainer} onPress={() => setIsEditProfileModalOpen(true)}>
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
                                </View>
                            )}
                            <View style={styles.cameraBadge}>
                                <Camera size={12} color={Palette.surfaceWhite} />
                            </View>
                        </Pressable>

                        <View style={{ flex: 1, marginLeft: 14 }}>
                            <Text style={styles.rowTitle}>{userName}</Text>
                            <Text style={styles.rowSubtitle}>Luteal Phase • Day 22</Text>
                        </View>

                        <Pressable style={styles.editButton} onPress={() => setIsEditProfileModalOpen(true)}>
                            <Edit3 size={16} color={Palette.oceanBlue} />
                            <Text style={styles.editButtonText}>Edit</Text>
                        </Pressable>
                    </View>
                </View>

                {/* BIOLOGICAL ENGINE SETUP (Triggers Engine Recalibration) */}
                {/* BIOLOGICAL ENGINE SETUP */}
                <Text style={styles.sectionHeader}>Biological Engine Setup</Text>
                <View style={GlobalStyles.cardElevated}>
                    <Pressable style={styles.settingRow} onPress={() => router.push('/reconfigure-biology')}>
                        <View style={styles.rowLeft}>
                            <View style={[styles.iconWrapper, { backgroundColor: Palette.surfaceGreenMuted }]}>
                                <Activity size={20} color={Palette.forestGreen} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowTitle}>Re-configure Biology & Goals</Text>
                                <Text style={styles.rowSubtitle}>Cycle, workout capacity, diet & friction points</Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color={Palette.textSecondary} />
                    </Pressable>
                

                <View style={styles.divider} />

                <Pressable
                    style={styles.settingRow}
                    onPress={() => triggerRecalibration('Manual trigger: Resyncing engine metrics to current day...')}
                >
                    <View style={styles.rowLeft}>
                        <View style={[styles.iconWrapper, { backgroundColor: Palette.surfaceBlueMuted }]}>
                            <RefreshCw size={20} color={Palette.oceanBlue} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.rowTitle}>Force Engine Recalibration</Text>
                            <Text style={styles.rowSubtitle}>Re-calculate daily adaptive rules now</Text>
                        </View>
                    </View>
                    <ChevronRight size={20} color={Palette.textSecondary} />
                </Pressable>
            </View>

            {/* PREFERENCES */}
            <Text style={styles.sectionHeader}>Preferences</Text>
            <View style={GlobalStyles.cardElevated}>
                <View style={styles.settingRow}>
                    <View style={styles.rowLeft}>
                        <View style={[styles.iconWrapper, { backgroundColor: Palette.surfaceGreenMuted }]}>
                            <Bell size={20} color={Palette.forestGreen} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.rowTitle}>Push Notifications</Text>
                            <Text style={styles.rowSubtitle}>Phase shift & recovery alerts</Text>
                        </View>
                    </View>
                    <Switch
                        value={pushNotifications}
                        onValueChange={setPushNotifications}
                        trackColor={{ false: Palette.borderSubtle, true: Palette.forestGreen }}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.settingRow}>
                    <View style={styles.rowLeft}>
                        <View style={[styles.iconWrapper, { backgroundColor: Palette.surfaceBlueMuted }]}>
                            <Moon size={20} color={Palette.skyBlue} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.rowTitle}>Haptic Feedback</Text>
                            <Text style={styles.rowSubtitle}>Tactile responses on interactive prompts</Text>
                        </View>
                    </View>
                    <Switch
                        value={hapticFeedback}
                        onValueChange={setHapticFeedback}
                        trackColor={{ false: Palette.borderSubtle, true: Palette.skyBlue }}
                    />
                </View>
            </View>

            {/* ACCOUNT ACTIONS */}
            <Text style={styles.sectionHeader}>Account Actions</Text>
            <View style={{ gap: 10, marginTop: 4, marginBottom: 40 }}>
                <Pressable
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                <LogOut size={18} color={Palette.textPrimary} />
                <Text style={styles.logoutText}>Log Out</Text>
                </Pressable>

                <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
                    <Trash2 size={18} color={Palette.crimson} />
                    <Text style={styles.deleteText}>Delete Account</Text>
                </Pressable>

                <Text style={styles.versionText}>Azuka Core Engine v1.0.4 (Build 42)</Text>
            </View>
        </ScrollView>

      {/* EDIT PROFILE MODAL */ }
    <Modal
        visible={isEditProfileModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditProfileModalOpen(false)}
    >
        <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
                <Text style={GlobalStyles.headingMedium}>Edit Profile</Text>

                <Pressable style={styles.modalAvatarContainer} onPress={handlePickImage}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.modalAvatarImage} />
                    ) : (
                        <View style={styles.modalAvatarPlaceholder}>
                            <Text style={styles.modalAvatarText}>{userName.charAt(0).toUpperCase()}</Text>
                        </View>
                    )}
                    <Text style={styles.changePhotoText}>Choose Photo from Gallery</Text>
                </Pressable>

                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                    style={GlobalStyles.inputField}
                    value={userName}
                    onChangeText={setUserName}
                    placeholder="Enter your name"
                />

                <View style={styles.modalActions}>
                    <Pressable
                        style={[GlobalStyles.btnOutline, { flex: 1 }]}
                        onPress={() => setIsEditProfileModalOpen(false)}
                    >
                        <Text style={GlobalStyles.btnOutlineText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                        style={[GlobalStyles.btnPrimary, { flex: 1, backgroundColor: Palette.oceanBlue }]}
                        onPress={handleSaveProfile}
                    >
                        <Text style={GlobalStyles.btnPrimaryText}>Save Changes</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    </Modal>

    {/* FULL PAGE RECALIBRATION & CELEBRATION ANIMATION */ }
    <Modal visible={isRecalibrating} animationType="fade" statusBarTranslucent>
        <SafeAreaView style={styles.fullScreenContainer}>
            <View style={styles.fullScreenContent}>
                <LottieView
                    source={{ uri: 'https://assets5.lottiefiles.com/packages/lf20_u4yrau.json' }}
                    autoPlay
                    loop={false}
                    style={styles.lottieAnimation}
                />

                <View style={styles.badgeContainer}>
                    <CheckCircle2 size={32} color={Palette.forestGreen} />
                </View>

                <Text style={styles.fullScreenTitle}>Recalibrating Engine</Text>
                <Text style={styles.fullScreenSubtitle}>
                    {recalibrateMessage || 'Aligning workouts, macros, and minimum-win targets...'}
                </Text>

                <Text style={styles.redirectingNotice}>Redirecting to Dashboard...</Text>
            </View>
        </SafeAreaView>
    </Modal>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
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
        backgroundColor: Palette.surfaceWhite,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Palette.borderSubtle,
    },
    scrollContent: {
        paddingVertical: 12,
    },
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
        backgroundColor: Palette.oceanBlue,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '800',
        color: Palette.surfaceWhite,
    },
    avatarImage: {
        width: 52,
        height: 52,
        borderRadius: 26,
    },
    cameraBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: Palette.marigold,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Palette.surfaceWhite,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Palette.surfaceBlueMuted,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    editButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: Palette.oceanBlue,
    },
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
        backgroundColor: Palette.borderSubtle,
        marginVertical: 4,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: Palette.surfaceWhite,
        borderWidth: 1,
        borderColor: Palette.borderSubtle,
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
        backgroundColor: Palette.surfaceCrimsonMuted,
        borderWidth: 1,
        borderColor: Palette.crimson,
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
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(20, 15, 10, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalCard: {
        width: '100%',
        backgroundColor: Palette.surfaceWhite,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    modalAvatarContainer: {
        alignItems: 'center',
        marginVertical: 16,
    },
    modalAvatarPlaceholder: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Palette.oceanBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalAvatarText: {
        fontSize: 28,
        fontWeight: '800',
        color: Palette.surfaceWhite,
    },
    modalAvatarImage: {
        width: 72,
        height: 72,
        borderRadius: 36,
        marginBottom: 8,
    },
    changePhotoText: {
        fontSize: 13,
        fontWeight: '700',
        color: Palette.oceanBlue,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: Palette.textPrimary,
        marginBottom: 6,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    fullScreenContainer: {
        flex: 1,
        backgroundColor: Palette.surfaceWhite,
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