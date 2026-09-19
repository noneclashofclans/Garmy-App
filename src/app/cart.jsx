import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Navbar from '../components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext'; 

const cart = () => {
    const router = useRouter();
    const { user, logout } = useAuth(); 
    const { cartItems, updateQuantity } = useCart();
    
    const calculateSubtotal = () => {
        return cartItems.reduce((acc, item) => {
            const numericPrice = typeof item.price === 'number' 
                ? item.price 
                : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
            return acc + numericPrice * item.quantity;
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const shipping = subtotal > 0 && subtotal < 300 ? 15.00 : 0.00;
    const grandTotal = subtotal + shipping;

    const handleCheckout = () => {
        if (!user) {
            Alert.alert('Login Required', 'Please log in to complete your checkout.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log In', onPress: () => router.push('/login') },
            ]);
            return;
        }
        Alert.alert('Order Placed Successfully 🙏', `Thank you for your order! Total: ₹${grandTotal.toFixed(2)}`);

        router.push('/choosePage')
    };

    const renderCartItem = ({ item }) => {
        const numericPrice = typeof item.price === 'number' 
            ? item.price 
            : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;

        return (
            <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
                <View style={styles.cardDetails}>
                    <Text style={styles.cardCategory}>{item.category}</Text>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title || item.name}</Text>
                    <Text style={styles.cardPrice}>₹{(numericPrice * item.quantity).toFixed(2)}</Text>
                </View>
                <View style={styles.qtyContainer}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.size, -1)}>
                        <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.size, 1)}>
                        <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar user={user} onLogout={logout} />  

            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Your cart is empty!</Text>
                    <Pressable style={styles.seeMoreBtn} onPress={() => router.push('/choosePage')}>
                        <Text style={styles.seeMoreText}>Explore Collections ➔</Text>
                    </Pressable>
                </View>
            ) : (
                <>
                    <View style={styles.headerSection}>
                        <Text style={styles.heading}>Your Shopping Cart</Text>
                    </View>

                    <FlatList
                        data={cartItems}
                        keyExtractor={(item, index) => `${item.id}-${item.size || index}`}
                        renderItem={renderCartItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Order Summary Footer */}
                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Shipping charges</Text>
                            <Text style={styles.summaryValue}>₹{shipping.toFixed(2)}</Text>
                        </View>
                        
                        <View style={styles.divider} />

                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Grand Total</Text>
                            <Text style={styles.totalValue}>₹{grandTotal.toFixed(2)}</Text>
                        </View>

                        <Pressable style={styles.button} onPress={handleCheckout}>
                            <Text style={styles.buttonText}>Place Order ➔</Text>
                        </Pressable>
                    </View>
                </>
            )}
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
        color: '#81bb5ae4',
        marginBottom: 8,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    card: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#05000066',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ffffff22',
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    cardImage: {
        width: 70,
        height: 70,
        borderRadius: 12,
        backgroundColor: '#252b24',
    },
    cardDetails: {
        flex: 1,
        marginLeft: 14,
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
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#252b24',
        borderRadius: 10,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: '#ffffff33',
    },
    qtyBtn: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyBtnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    qtyText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        paddingHorizontal: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyText: {
        color: 'white',
        fontSize: 18,
        marginBottom: 20,
    },
    seeMoreBtn: {
        alignSelf: 'center',
        backgroundColor: '#252b24',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ffffff33',
    },
    seeMoreText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
    summaryContainer: {
        backgroundColor: '#05000066',
        padding: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 1,
        borderColor: '#ffffff22',
        borderRadius: 32,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        color: '#ccc',
        fontSize: 15,
    },
    summaryValue: {
        color: 'white',
        fontSize: 15,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#ffffff33',
        marginVertical: 10,
    },
    totalLabel: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        color: '#70b56b',
        fontSize: 20,
        fontWeight: 'bold',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#445b42',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default cart;