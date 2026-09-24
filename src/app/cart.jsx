import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Alert,
    Pressable,
    Modal,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Navbar from '../components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import RazorpayCheckout from 'react-native-razorpay';

const ADDRESSES_API = 'https://garmy-app-mariadb-backend-with-razorpay.onrender.com';
const RAZORPAY_KEY_ID = 'rzp_test_TfqUHhDAnMWt0L';

const cart = () => {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { cartItems, updateQuantity } = useCart();

    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    const [addressText, setAddressText] = useState('');
    const [savingAddress, setSavingAddress] = useState(false);

    useEffect(() => {
        if (user?.email) {
            fetch(`${ADDRESSES_API}/api/addresses/${user.email}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.success && data.data?.address) {
                        setAddressText(data.data.address);
                    }
                })
                .catch((err) => console.log('Could not fetch user address:', err.message));
        }
    }, [user?.email]);

    const calculateSubtotal = () => {
        return cartItems.reduce((acc, item) => {
            const numericPrice = typeof item.price === 'number'
                ? item.price
                : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
            return acc + numericPrice * item.quantity;
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const shipping = subtotal > 0 && subtotal < 600 ? 15.00 : 0.00;
    const government_taxes = 0.05 * subtotal;
    const grandTotal = subtotal + shipping + government_taxes;

    const handleCheckout = () => {
        if (!user) {
            Alert.alert('Login Required', 'Please log in to complete your checkout.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log In', onPress: () => router.push('/login') },
            ]);
            return;
        }

        setIsAddressModalVisible(true);
    };

    const handleSaveAddressAndProceed = async () => {
        if (!addressText.trim()) {
            Alert.alert('Missing Address', 'Please enter your full delivery address.');
            return;
        }

        setSavingAddress(true);

        try {
            const response = await fetch(`${ADDRESSES_API}/api/addresses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    address: addressText.trim()
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setIsAddressModalVisible(false);
                setIsPaymentModalVisible(true);
            } else {
                Alert.alert('Error', data.message || 'Could not save address.');
            }
        } catch (err) {
            Alert.alert('Connection Error', 'Could not connect to the address service.');
        } finally {
            setSavingAddress(false);
        }
    };

    const handleSelectPayment = async (type) => {
        if (type === 'COD') {
            setIsPaymentModalVisible(false);
            Alert.alert('Success', 'Order placed successfully!');
            router.push('/');
        } else if (type === 'UPI') {
            try {

                const response = await fetch(`${ADDRESSES_API}/api/upi_payment/create-order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: grandTotal }),
                });

                const data = await response.json();

                if (!data.success) {
                    Alert.alert('Error', 'Could not initialize payment.');
                    return;
                }

                const options = {
                    description: 'Garmy App Order Payment',
                    currency: 'INR',
                    key: RAZORPAY_KEY_ID,
                    amount: data.order.amount,
                    name: 'Garmy Store',
                    order_id: data.order.id,
                    prefill: {
                        email: user.email,
                        contact: user.phone || user.contact || '',
                        name: user.name || 'Garmy Customer',
                    },
                    theme: { color: '#78a474' }
                };

                RazorpayCheckout.open(options)
                    .then((paymentData) => {
                        setIsPaymentModalVisible(false);
                        Alert.alert(
                            'Payment Successful!',
                            `Payment ID: ${paymentData.razorpay_payment_id}`
                        );
                        router.push('/');
                    })
                    .catch((error) => {
                        console.log('Razorpay Failure Detail:', error);
                        Alert.alert(
                            'Payment Error',
                            `Please try again after sometime..`
                        );
                    });

            } catch (err) {
                Alert.alert('Error', 'Unable to process UPI payment right now.');
            }
        }
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

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>GST (5%)</Text>
                            <Text style={styles.summaryValue}>₹{government_taxes.toFixed(2)}</Text>
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

            {/* Address Modal */}
            <Modal
                visible={isAddressModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsAddressModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Delivery Address</Text>
                        <Text style={styles.modalSubTitle}>Enter your address for shipping</Text>

                        <TextInput
                            style={styles.addressInput}
                            placeholder="Street, City, Zip, State..."
                            placeholderTextColor="#888"
                            value={addressText}
                            onChangeText={setAddressText}
                            multiline
                            numberOfLines={3}
                        />

                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelModalButton]}
                                onPress={() => setIsAddressModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmModalButton]}
                                onPress={handleSaveAddressAndProceed}
                                disabled={savingAddress}
                            >
                                {savingAddress ? (
                                    <ActivityIndicator color="#050000" size="small" />
                                ) : (
                                    <Text style={styles.confirmButtonText}>Next</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Payment Options Modal */}
            <Modal
                visible={isPaymentModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsPaymentModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Select Payment Method</Text>

                        <TouchableOpacity
                            style={styles.paymentOption}
                            onPress={() => handleSelectPayment('COD')}
                        >
                            <Text style={styles.paymentOptionText}>Cash on Delivery (COD)</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.paymentOption}
                            onPress={() => handleSelectPayment('UPI')}
                        >
                            <Text style={styles.paymentOptionText}>UPI / Online Payment</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelModalButton, { marginTop: 10 }]}
                            onPress={() => setIsPaymentModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Back</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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

    /* Modal Styles */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalCard: {
        width: '100%',
        backgroundColor: '#252b24',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ffffff22',
    },
    modalTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    modalSubTitle: {
        color: '#aaa',
        fontSize: 13,
        marginBottom: 16,
    },
    addressInput: {
        width: '100%',
        minHeight: 80,
        backgroundColor: '#1b201a',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        color: 'white',
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#ffffff33',
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    modalButtonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        height: 46,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelModalButton: {
        backgroundColor: '#384237',
    },
    confirmModalButton: {
        backgroundColor: '#70b56b',
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    confirmButtonText: {
        color: '#050000',
        fontWeight: 'bold',
    },
    paymentOption: {
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#1b201a',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ffffff22',
    },
    paymentOptionText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default cart;