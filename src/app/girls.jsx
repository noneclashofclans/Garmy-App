import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import Navbar from '../components/Navbar';
import { useAuth } from '@/context/AuthContext';

const GIRLS_PRODUCTS = [
    {
        id: '1',
        title: 'Floral Embroidered Cotton Dress',
        price: '₹389.00',
        category: 'Dresses',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80',
    },
    {
        id: '2',
        title: 'High-Waist Denim Skirt',
        price: '₹320.00',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80',
    },
    {
        id: '3',
        title: 'Pastel Corduroy Jacket',
        price: '₹508.00',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=500&q=80',
    },
    {
        id: '4',
        title: 'Ribbed Knit Crew Sweater',
        price: '₹420.00',
        category: 'Sweatshirts',
        image: 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?w=500&q=80',
    },
    {
        id: '5',
        title: 'Graphic Oversized Tee',
        price: '₹260.00',
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80',
    },
    {
        id: '6',
        title: 'Wide Leg Cargo Overalls',
        price: '₹480.00',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=500&q=80',
    },
    {
        id: '7',
        title: 'Sherpa Lined Denim Vest',
        price: '₹529.00',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
    },
    {
        id: '8',
        title: 'Cropped Fleece Pullover',
        price: '₹390.00',
        category: 'Sweatshirts',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80',
    },
    {
        id: '9',
        title: 'Puff Sleeve Linen Top',
        price: '₹300.00',
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&q=80',
    },
    {
        id: '10',
        title: 'Pleated Tennis Skirt',
        price: '₹299.00',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80',
    },
    {
        id: '11',
        title: 'Quilted Puffer Jacket',
        price: '₹650.00',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80',
    },
    {
        id: '12',
        title: 'Tiered Summer Sundress',
        price: '₹450.00',
        category: 'Dresses',
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80',
    },
    {
        id: '13',
        title: 'Zip-Up Tie-Dye Hoodie',
        price: '₹400.00',
        category: 'Sweatshirts',
        image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=500&q=80',
    },
    {
        id: '14',
        title: 'Distressed Mom Jeans',
        price: '₹449.00',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=500&q=80',
    },
    {
        id: '15',
        title: 'Faux Shearling Coat',
        price: '₹780.00',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80',
    },
    {
        id: '16',
        title: 'Relaxed Button-Front Blouse',
        price: '₹340.00',
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80',
    },
    {
        id: '17',
        title: 'Fine-Knit Cardigan',
        price: '₹360.00',
        category: 'Sweatshirts',
        image: 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=500&q=80',
    },
    {
        id: '18',
        title: 'Relaxed Fit Joggers',
        price: '₹359.00',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80',
    },
    {
        id: '19',
        title: 'Smocked Midi Pinafore Dress',
        price: '₹460.00',
        category: 'Dresses',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80',
    },
    {
        id: '20',
        title: 'Cropped Denim Trucker Jacket',
        price: '₹540.00',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=500&q=80',
    },
];


const boys = () => {
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
                <Text style={styles.heading}>Girl's Collection</Text>
            </View>

            {/* Product Grid */}
            <FlatList
                data={GIRLS_PRODUCTS}
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

    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#d94ce3e4',
        marginBottom: 12,
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

export default boys;