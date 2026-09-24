import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import Navbar from '../components/Navbar';
import { useAuth } from '@/context/AuthContext';

const WOMENS_PRODUCTS = [
    {
        id: '1',
        title: 'Oversized Linen Shirt',
        price: '₹420.00',
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&q=80',
    },
    {
        id: '2',
        title: 'High-Waisted Wide Leg Pants',
        price: '₹720.00',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=500&q=80',
    },
    {
        id: '3',
        title: 'Cropped Denim Jacket',
        price: '₹880.00',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=500&q=80',
    },
    {
        id: '4',
        title: 'Earth Toned Ribbed Knit Dress',
        price: '₹650.00',
        category: 'Dresses',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80',
    },
    {
        id: '5',
        title: 'Vintage Wash Graphic Tee',
        price: '₹340.00',
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80',
    },
    {
        id: '6',
        title: 'Pleated Midi Skirt',
        price: '₹599.00',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80',
    },
    {
        id: '7',
        title: 'Wool Blend Tailored Coat',
        price: '₹1,650.00',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80',
    },
    {
        id: '8',
        title: 'Chunky Cable Knit Sweater',
        price: '₹789.00',
        category: 'Sweatshirts',
        image: 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?w=500&q=80',
    },
    {
        id: '9',
        title: 'Silk Satin Camisole',
        price: '₹499.00',
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80',
    },
    {
        id: '10',
        title: 'Straight Leg Cargo Trousers',
        price: '₹680.00',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80',
    },
    {
        id: '11',
        title: 'Oversized Trench Coat',
        price: '₹1,400.00',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80',
    },
    {
        id: '12',
        title: 'Minimalist Tiered Maxi Dress',
        price: '₹820.00',
        category: 'Dresses',
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80',
    },
    {
        id: '13',
        title: 'Cropped Fleece Hoodie',
        price: '₹520.00',
        category: 'Sweatshirts',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80',
    },
    {
        id: '14',
        title: 'High-Waist Biker Shorts',
        price: '₹320.00',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80',
    },
    {
        id: '15',
        title: 'Faux Leather Puffer Vest',
        price: '₹950.00',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=500&q=80',
    },
    {
        id: '16',
        title: 'Relaxed Fit Button-Down',
        price: '₹489.00',
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80',
    },
    {
        id: '17',
        title: 'Ribbed Cardigan Sweater',
        price: '₹640.00',
        category: 'Sweatshirts',
        image: 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=500&q=80',
    },
    {
        id: '18',
        title: 'Distressed Mom Jeans',
        price: '₹760.00',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=500&q=80',
    },
    {
        id: '19',
        title: 'Floral Summer Wrap Dress',
        price: '₹700.00',
        category: 'Dresses',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80',
    },
    {
        id: '20',
        title: 'Fleece Lined Sherpa Jacket',
        price: '₹1,250.00',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
    },
];


const womens = () => {
    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === '/';

    const { user, logout } = useAuth();

    const renderProductCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push({
                pathname: '/productDetails',
                params: {
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    image: item.image,
                    category: item.category,
                }
            })}
        >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardDetails}>
                <Text style={styles.cardCategory}>{item.category}</Text>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Navbar user={user} onLogout={logout} />  

            {!isHome && (
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←back</Text>
                </TouchableOpacity>
            )}

            <View style={styles.headerSection}>
                <Text style={styles.heading}>Women's Collection</Text>
            </View>

            {/* Product Grid */}
            <FlatList
                data={WOMENS_PRODUCTS}
                keyExtractor={(item) => item.id}
                renderItem={renderProductCard}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4f5d4e',
    },
    headerSection: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#e34c77e4',
        marginBottom: 12,
    },

    backButton: {
        marginRight: "auto",
        marginLeft: 15,
        marginTop: 7,
        marginBottom: 7,
        backgroundColor: "#478e3756",
        paddingRight: 10,
        paddingLeft: 6,
        borderRadius: 10,
        paddingTop: 7,
        paddingBottom: 7
    },
    backIcon: {
        color: "#6ade87",
        fontSize: 17,
        fontWeight: 'bold',
    },

    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        width: '48%',
        backgroundColor: '#05000066',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ffffff22',
    },
    cardImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#252b24',
    },
    cardDetails: {
        padding: 12,
    },
    cardCategory: {
        color: '#aaa',
        fontSize: 12,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    cardTitle: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    cardPrice: {
        color: '#70b56b',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default womens;