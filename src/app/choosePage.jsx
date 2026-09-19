import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Navbar from '../components/Navbar';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = ['Mens', 'Womens', 'Boys', 'Girls'];
const ITEM_HEIGHT = 54;
const VISIBLE_ITEMS = 3;


const Flower = ({ size = 24, opacity = 0.5 }) => (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        {[0, 1, 2, 3, 4].map((i) => (
            <View
                key={i}
                style={{
                    position: 'absolute',
                    width: size * 0.32,
                    height: size * 0.56,
                    borderRadius: size * 0.16,
                    backgroundColor: '#ffffff',
                    opacity,
                    transform: [{ rotate: `${i * 72}deg` }, { translateY: -size * 0.24 }],
                }}
            />
        ))}
        <View
            style={{
                width: size * 0.22,
                height: size * 0.22,
                borderRadius: size * 0.11,
                backgroundColor: '#ffffff',
                opacity: Math.min(1, opacity + 0.35),
            }}
        />
    </View>
);

const FlowerColumn = ({ side }) => (
    <View
        pointerEvents="none"
        style={[styles.flowerColumn, side === 'left' ? styles.flowerLeft : styles.flowerRight]}
    >
        <Flower size={18} opacity={0.28} />
        <Flower size={28} opacity={0.5} />
        <Flower size={20} opacity={0.35} />
        <Flower size={32} opacity={0.55} />
        <Flower size={18} opacity={0.3} />
        <Flower size={26} opacity={0.45} />
        <Flower size={16} opacity={0.25} />
    </View>
);


const choosePage = () => {
    const router = useRouter();
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { user, logout } = useAuth();


    const handleItemPress = (index) => {
        scrollViewRef.current?.scrollTo({
            y: index * ITEM_HEIGHT,
            animated: true,
        });
    };

    const handleNavigate = () => {
        const selectedCategory = CATEGORIES[selectedIndex].toLowerCase();
        router.push(`/${selectedCategory}`);
    };
    

    return (
        <SafeAreaView style={styles.container}>
            <Navbar user={user} onLogout={logout} />  

            <FlowerColumn side="left" />
            <FlowerColumn side="right" />


            <View style={styles.drumContainer}>
                <View style={styles.selectionIndicator} pointerEvents="none" />

                <Animated.ScrollView
                    ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    scrollEventThrottle={16}
                    contentContainerStyle={{
                        paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
                    }}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        {
                            useNativeDriver: true,
                            listener: (event) => {
                                const offsetY = event.nativeEvent.contentOffset.y;
                                const index = Math.round(offsetY / ITEM_HEIGHT);
                                if (index >= 0 && index < CATEGORIES.length) {
                                    setSelectedIndex(index);
                                }
                            },
                        }
                    )}
                >
                    {CATEGORIES.map((item, index) => {
                        const inputRange = [
                            (index - 2) * ITEM_HEIGHT,
                            (index - 1) * ITEM_HEIGHT,
                            index * ITEM_HEIGHT,
                            (index + 1) * ITEM_HEIGHT,
                            (index + 2) * ITEM_HEIGHT,
                        ];

                        const scale = scrollY.interpolate({
                            inputRange,
                            outputRange: [0.75, 0.88, 1.15, 0.88, 0.75],
                            extrapolate: 'clamp',
                        });

                        const opacity = scrollY.interpolate({
                            inputRange,
                            outputRange: [0.25, 0.55, 1, 0.55, 0.25],
                            extrapolate: 'clamp',
                        });

                        const rotateX = scrollY.interpolate({
                            inputRange,
                            outputRange: ['70deg', '38deg', '0deg', '-38deg', '-70deg'],
                            extrapolate: 'clamp',
                        });

                        const translateY = scrollY.interpolate({
                            inputRange,
                            outputRange: [
                                ITEM_HEIGHT * 0.42,
                                ITEM_HEIGHT * 0.16,
                                0,
                                -ITEM_HEIGHT * 0.16,
                                -ITEM_HEIGHT * 0.42,
                            ],
                            extrapolate: 'clamp',
                        });

                        const scaleY = scrollY.interpolate({
                            inputRange,
                            outputRange: [0.45, 0.72, 1, 0.72, 0.45],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Pressable key={item} onPress={() => handleItemPress(index)}>
                                <Animated.View
                                    style={[
                                        styles.itemSlot,
                                        {
                                            opacity,
                                            transform: [
                                                { perspective: 600 },
                                                { translateY },
                                                { rotateX },
                                                { scale },
                                                { scaleY },
                                            ],
                                        },
                                    ]}
                                >
                                    <Text style={styles.itemText}>{item}</Text>
                                </Animated.View>
                            </Pressable>
                        );
                    })}
                </Animated.ScrollView>
            </View>


            <View style={styles.footer}>
                <Text style={styles.selectedLabel}>
                    Selected: <Text style={styles.selectedValue}>{CATEGORIES[selectedIndex]}</Text>
                </Text>

                <Pressable style={styles.goButton} onPress={handleNavigate}>
                    <Text style={styles.goButtonText}>Let's go! ➔</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4f5d4e',
    },

    flowerColumn: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 46,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: 60,
        zIndex: 0,
    },
    flowerLeft: {
        left: 0,
    },
    flowerRight: {
        right: 0,
    },
    drumContainer: {
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        width: 220,
        alignSelf: 'center',
        marginVertical: 'auto',
        position: 'relative',
        overflow: 'hidden',
    },
    selectionIndicator: {
        position: 'absolute',
        top: ITEM_HEIGHT,
        left: 0,
        right: 0,
        height: ITEM_HEIGHT,
        backgroundColor: '#cfd8cf28',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#ffffff44',
        zIndex: 1
    },
    itemSlot: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backfaceVisibility: 'hidden',
    },
    itemText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#ffffff',
    },
    footer: {
        alignItems: 'center',
        marginBottom: 50,
        gap: 16,
    },
    selectedLabel: {
        color: '#ccc',
        fontSize: 16,
    },
    selectedValue: {
        color: '#a7ffab',
        fontWeight: 'bold',
        fontSize: 18
    },
    goButton: {
        backgroundColor: '#252b24',
        paddingVertical: 12,
        paddingHorizontal: 36,
        borderRadius: 11,
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    goButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default choosePage;