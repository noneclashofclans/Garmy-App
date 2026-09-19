import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import Navbar from '../components/Navbar';
import { useAuth } from '@/context/AuthContext';

const BOYS_PRODUCTS = [
    {
        id: '1',
        title: 'Oversized Skate Graphic Tee',
        price: '₹280.00',
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80',
    },
    {
        id: '2',
        title: 'Relaxed Jogger Cargo Pants',
        price: '₹450.00',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80',
    },
    {
        id: '3',
        title: 'Colorblock Windbreaker Jacket',
        price: '₹629.00',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&q=80',
    },
    {
        id: '4',
        title: 'Fleece Heavyweight Hoodie',
        price: '₹420.00',
        category: 'Sweatshirts',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80',
    },
    {
        id: '5',
        title: 'Washed Olive Crew Tee',
        price: '₹250.00',
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80',
    },
    {
        id: '6',
        title: 'Baggy Denim Jeans',
        price: '₹480.00',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80',
    },
    {
        id: '7',
        title: 'Varsity Patch Bomber Jacket',
        price: '₹759.00',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
    },
    {
        id: '8',
        title: 'Essential Crewneck Sweatshirt',
        price: '₹388.00',
        category: 'Sweatshirts',
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80',
    },
    {
        id: '9',
        title: 'Streetwear Baseball Jersey',
        price: '₹350.00',
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
    },
    {
        id: '10',
        title: 'Utility Cargo Shorts',
        price: '₹360.00',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80',
    },
    {
        id: '11',
        title: 'Puffer Quilted Vest',
        price: '₹580.00',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80',
    },
    {
        id: '12',
        title: 'Half-Zip Fleece Pullover',
        price: '₹440.00',
        category: 'Sweatshirts',
        image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&q=80',
    },
    {
        id: '13',
        title: 'Striped Plaid Overshirt',
        price: '₹400.00',
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80',
    },
    {
        id: '14',
        title: 'Slim Fit Track Pants',
        price: '₹399.00',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80',
    },
    {
        id: '15',
        title: 'Faux Leather Biker Jacket',
        price: '₹850.00',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=500&q=80',
    },
    {
        id: '16',
        title: 'Zip-Up Graphic Hoodie',
        price: '₹460.00',
        category: 'Sweatshirts',
        image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=500&q=80',
    },
    {
        id: '17',
        title: 'Raw Edge Pocket Tee',
        price: '₹249.00',
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80',
    },
    {
        id: '18',
        title: 'Distressed Knee Denim',
        price: '₹520.00',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=500&q=80',
    },
    {
        id: '19',
        title: 'Sherpa Lined Parka Coat',
        price: '₹899.00',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80',
    },
    {
        id: '20',
        title: 'Chunky Knit Sweater',
        price: '₹480.00',
        category: 'Sweatshirts',
        image: 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=500&q=80',
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
                <Text style={styles.heading}>Boy's Collection</Text>
            </View>

            {/* Product Grid */}
            <FlatList
                data={BOYS_PRODUCTS}
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
        marginLeft: 5,
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
        color: '#e3d14ce4',
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