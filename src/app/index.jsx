import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import { useRouter } from 'expo-router';

import { useAuth } from '@/context/AuthContext';

const screenWidth = Dimensions.get('window').width;
const CAROUSEL_WIDTH = screenWidth - 24;

const dresses = [
    {
        id: 1,
        for: "mens",
        category: "formals",
        name: "Classic Navy Charcoal Suit",
        price: "₹1099",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        for: "mens",
        category: "formals",
        name: "White Oxford Dress Shirt",
        price: "₹899",
        image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 37,
        for: "womens",
        category: "winters",
        name: "Chunky Turtleneck Sweater",
        price: "₹1,299",
        image: "https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 38,
        for: "womens",
        category: "winters",
        name: "Fleece Leggings",
        price: "₹699",
        image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 40,
        for: "womens",
        category: "winters",
        name: "Knit Sweater Dress",
        price: "₹1,499",
        image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        for: "mens",
        category: "casuals",
        name: "Cotton Crewneck T-Shirt",
        price: "₹499",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        for: "mens",
        category: "casuals",
        name: "Casual Flannel Button-Down",
        price: "₹999",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 9,
        for: "mens",
        category: "casuals",
        name: "Chino Shorts",
        price: "₹799",
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80"
    },
];

const carouselItems = [
    { id: 'c1', image: dresses[0].image, label: 'Formals for him', sub: 'Sharp suits, crisp shirts' },
    { id: 'c2', image: dresses[2].image, label: 'Winter edit', sub: 'Cozy knits & layers' },
    { id: 'c3', image: dresses[1].image, label: 'Premium formals', sub: 'Relaxed, sharp looking' },
    { id: 'c4', image: dresses[4].image, label: 'Weekend flannels', sub: 'Comfort meets style' },
];

const Index = () => {
    const router = useRouter();
    const translateX = useRef(new Animated.Value(screenWidth)).current;

    const { user, logout } = useAuth();

    const carouselRef = useRef(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const autoSlideTimer = useRef(null);

    useEffect(() => {
        translateX.setValue(screenWidth);
        Animated.loop(
            Animated.timing(translateX, {
                toValue: -screenWidth * 2.2,
                duration: 14000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [translateX]);

    useEffect(() => {
        autoSlideTimer.current = setInterval(() => {
            setActiveSlide((prev) => {
                const next = (prev + 1) % carouselItems.length;
                carouselRef.current?.scrollToOffset({
                    offset: next * CAROUSEL_WIDTH,
                    animated: true,
                });
                return next;
            });
        }, 3000);

        return () => clearInterval(autoSlideTimer.current);
    }, []);

    const handleCarouselScrollEnd = (e) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / CAROUSEL_WIDTH);
        setActiveSlide(index);
    };

    const renderCarouselItem = ({ item }) => (
        <View style={styles.carouselSlide}>
            <Image source={{ uri: item.image }} style={styles.carouselImage} resizeMode="cover" />
            <View style={styles.carouselOverlay}>
                <Text style={styles.carouselLabel}>{item.label}</Text>
                <Text style={styles.carouselSub}>{item.sub}</Text>
            </View>
        </View>
    );

    const renderProductCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push({
                pathname: '/productDetails',
                params: {
                    id: item.id,
                    title: item.name,
                    price: item.price,
                    image: item.image,
                    category: `${item.for.toUpperCase()} • ${item.category}`,
                }
            })}
        >
            <Image
                source={{ uri: item.image }}
                style={styles.cardImage}
                resizeMode="cover"
            />
            <View style={styles.cardDetails}>
                <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.subtitle}>
                    {item.for.toUpperCase()} • {item.category}
                </Text>
                <Text style={styles.price}>{item.price}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Navbar user={user} onLogout={logout} />  

            {/* Top Marquee Bar */}
            <View style={styles.welcome}>
                <Animated.View style={[styles.marqueeWrapper, { transform: [{ translateX }] }]}>
                    <Text style={styles.welcomeTitle}>
                        {"Explore a wide range of collection for Mens and Womens!".replace(/\s+/g, '\u00A0')}
                    </Text>
                </Animated.View>
            </View>

            {/* Sliding Image Carousel */}
            <View style={styles.carouselContainer}>
                <FlatList
                    ref={carouselRef}
                    data={carouselItems}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleCarouselScrollEnd}
                    renderItem={renderCarouselItem}
                    snapToInterval={CAROUSEL_WIDTH}
                    decelerationRate="fast"
                />
                <View style={styles.dotsRow}>
                    {carouselItems.map((_, i) => (
                        <View
                            key={i}
                            style={[styles.dot, i === activeSlide && styles.dotActive]}
                        />
                    ))}
                </View>
            </View>


            {/* Featured Product Grid */}
            <FlatList
                data={dresses}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                renderItem={renderProductCard}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <Pressable style={styles.seeMoreBtn} onPress={() => router.push('/choosePage')}>
                        <Text style={styles.seeMoreText}>See more ➔</Text>
                    </Pressable>
                }
            />

            <View style={styles.discountBar}>
                <Animated.View style={[styles.marqueeWrapper, { transform: [{ translateX }] }]}>
                    <Text style={styles.welcomeTitle}>
                        {"Shop for ₹2000, get a flat 10% discount on your 1st order!".replace(/\s+/g, '\u00A0')}
                    </Text>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#4f5d4e",
    },
    listContent: {
        padding: 12,
        paddingBottom: 24,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    welcome: {
        marginTop: 3,
        marginBottom: 10,
        backgroundColor: "#1f79b57e",
        paddingVertical: 4,
        overflow: 'hidden',
        width: '100%',
    },
    marqueeWrapper: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
    },
    welcomeTitle: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },

    carouselContainer: {
        marginHorizontal: 12,
        marginBottom: 14
    },

    carouselSlide: {
        width: CAROUSEL_WIDTH,
        height: 220,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: "#252b24",
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    carouselImage: {
        width: '100%',
        height: '100%',
    },
    carouselOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    carouselLabel: {
        color: "#a9ce79",
        fontSize: 16,
        fontWeight: "bold",
    },
    carouselSub: {
        color: "#eee",
        fontSize: 12,
        marginTop: 2,
    },
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#8c9354a0",
        marginHorizontal: 4,
    },
    dotActive: {
        backgroundColor: "#99ba62",
        width: 16,
    },

    card: {
        width: "48%",
        backgroundColor: "#252b24",
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    cardImage: {
        width: '100%',
        height: 150,
    },
    cardDetails: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    title: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
    },
    subtitle: {
        color: "#ccc",
        fontSize: 12,
        marginTop: 2,
        textTransform: 'capitalize',
    },
    price: {
        color: "#70b56b",
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 4,
    },
    seeMoreBtn: {
        alignSelf: 'center',
        backgroundColor: '#252b24',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ffffff33',
    },
    seeMoreText: {
        color: "white",
        fontSize: 15,
        fontWeight: "600",
    },
    discountBar: {
        marginBottom: 1,
        backgroundColor: "#b56a1f7e",
        paddingVertical: 8,
        overflow: 'hidden',
        width: '100%',
    },
});

export default Index;