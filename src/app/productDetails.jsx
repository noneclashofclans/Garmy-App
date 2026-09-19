import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, usePathname } from 'expo-router';
import Navbar from '../components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const REVIEWS_API = 'https://garmy-app-reviews-backend.onrender.com';



const StarRow = ({ rating, onRate, size = 22, readOnly = false }) => (
    <View style={{ flexDirection: 'row', gap: 4 }}>
        {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
                key={n}
                disabled={readOnly}
                onPress={() => onRate && onRate(n)}
                hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            >
                <Text style={{ fontSize: size, color: n <= rating ? '#f3fc7b' : '#5a6459' }}>
                    {n <= rating ? '★' : '☆'}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

const productDetails = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const pathname = usePathname();
    const isHome = pathname === '/';

    const { user, logout } = useAuth();
    const { addToCart } = useCart();
    const isAuthenticated = !!user;    

    const { id, title, price, image, category } = params;   
    
    const [selectedSize, setSelectedSize] = useState('M');
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const fetchReviews = useCallback(async () => {
        try {
            const response = await fetch(`${REVIEWS_API}/api/reviews/${id}`);
            const data = await response.json();
            if (response.ok) {
                setReviews(data);
            }
        } catch (err) {
            console.log('Could not fetch reviews:', err.message);
        } finally {
            setLoadingReviews(false);
        }
    }, [id]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const averageRating = reviews.length
        ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.filter(r => r.rating).length || 0)
        : 0;

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            Alert.alert(
                'Authentication Required',
                'Please log in to add items to your cart.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Log In', onPress: () => router.push('/login') }
                ]
            );
            return;
        }

        addToCart({ id, title, price, image, category, size: selectedSize });   

        Alert.alert('Success', `Added ${title} (${selectedSize}) to your cart!`);
    };

    const handleSubmitReview = async () => {
        if (!isAuthenticated) {
            Alert.alert(
                'Authentication Required',
                'Please log in to leave a review.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Log In', onPress: () => router.push('/login') }
                ]
            );
            return;
        }

        if (!reviewText.trim()) {
            Alert.alert('Empty Review', 'Please write something before submitting.');
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(`${REVIEWS_API}/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: id,
                    userEmail: user.email,
                    userName: user.name,
                    reviewText: reviewText.trim(),
                    rating: reviewRating || null,
                }),
            });
            const data = await response.json();

            if (response.ok) {
                setReviewText('');
                setReviewRating(0);
                fetchReviews();
            } else {
                Alert.alert('Error', data.message || 'Could not submit review');
            }
        } catch (err) {
            Alert.alert('Connection Error', 'Unable to reach the reviews server. Check your local server is running and the URL is correct.');
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDeleteReview = (reviewId) => {
        Alert.alert(
            'Delete review?',
            'This will permanently remove your review.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => handleDeleteReview(reviewId) },
            ]
        );
    };

    const handleDeleteReview = async (reviewId) => {
        setDeletingId(reviewId);
        try {
            const response = await fetch(`${REVIEWS_API}/api/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: user.email }),
            });
            const data = await response.json();

            if (response.ok) {
                fetchReviews();
            } else {
                Alert.alert('Error', data.message || 'Could not delete review');
            }
        } catch (err) {
            Alert.alert('Connection Error', 'Unable to reach the reviews server.');
        } finally {
            setDeletingId(null);
        }
    };

    const isSubmitDisabled = submitting || !reviewText.trim();

    return (
        <SafeAreaView style={styles.container}>
            <Navbar user={user} onLogout={logout} />  

            {!isHome && (
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←back</Text>
                </TouchableOpacity>
            )}

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Product Image */}
                <Image 
                    source={{ uri: image || 'https://via.placeholder.com/400' }} 
                    style={styles.productImage} 
                    resizeMode="cover"
                />

                {/* Details Container */}
                <View style={styles.detailsCard}>
                    <Text style={styles.category}>{category || 'Collection'}</Text>
                    <Text style={styles.title}>{title || 'Product Title'}</Text>
                    <Text style={styles.price}>{price || '₹0.00'}</Text>

                    {/* Size Selector */}
                    <Text style={styles.sectionLabel}>Select Size</Text>
                    <View style={styles.sizeContainer}>
                        {SIZES.map((size) => {
                            const isSelected = selectedSize === size;
                            return (
                                <TouchableOpacity
                                    key={size}
                                    style={[styles.sizeBox, isSelected && styles.selectedSizeBox]}
                                    onPress={() => setSelectedSize(size)}
                                >
                                    <Text style={[styles.sizeText, isSelected && styles.selectedSizeText]}>
                                        {size}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Add to Cart Button */}
                    <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart} activeOpacity={0.8}>
                        <Text style={styles.cartButtonText}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.reviewContainer}>
                    <View style={styles.reviewHeader}>
                        <View>
                            <Text style={styles.giveReview}>Reviews</Text>
                            <Text style={styles.help}>Help others know this product better</Text>
                        </View>
                        {reviews.length > 0 && (
                            <View style={styles.summaryBadge}>
                                <Text style={styles.summaryAvg}>{averageRating.toFixed(1)} ★</Text>
                                <Text style={styles.summaryCount}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</Text>
                            </View>
                        )}
                    </View>

                    
                    <View style={styles.composer}>
                        <Text style={styles.composerLabel}>Your rating</Text>
                        <StarRow rating={reviewRating} onRate={setReviewRating} />

                        <TextInput
                            style={styles.reviewInput}
                            placeholder="What did you think of this product?"
                            placeholderTextColor="#aaa"
                            value={reviewText}
                            onChangeText={setReviewText}
                            multiline
                            numberOfLines={4}
                            maxLength={500}
                            editable={!submitting}
                        />
                        <Text style={styles.charCount}>{reviewText.length}/500</Text>

                        <TouchableOpacity
                            style={[styles.reviewButton, isSubmitDisabled && styles.reviewButtonDisabled]}
                            onPress={handleSubmitReview}
                            activeOpacity={0.8}
                            disabled={isSubmitDisabled}
                        >
                            {submitting ? (
                                <ActivityIndicator color="#70b56b" size="small" />
                            ) : (
                                <Text style={styles.reviewButtonText}>Submit Review</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Existing reviews */}
                    <View style={styles.reviewsList}>
                        {loadingReviews ? (
                            <ActivityIndicator color="#70b56b" style={{ marginTop: 16 }} />
                        ) : reviews.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyEmoji}>💬</Text>
                                <Text style={styles.noReviews}>No reviews yet — be the first to share your thoughts about this product!</Text>
                            </View>
                        ) : (
                            reviews.map((r) => {
                                const isOwn = isAuthenticated && user.email === r.user_email;
                                const displayName = r.user_name || r.user_email.split('@')[0];
                                const initial = displayName.charAt(0).toUpperCase();

                                return (
                                    <View key={r.id} style={styles.reviewItem}>
                                        <View style={styles.reviewItemHeader}>
                                            <View style={styles.reviewerRow}>
                                                <View style={styles.avatar}>
                                                    <Text style={styles.avatarText}>{initial}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.reviewAuthor}>
                                                        {displayName}{isOwn ? ' (You)' : ''}
                                                    </Text>
    
                                                </View>
                                            </View>

                                            {isOwn && (
                                                <TouchableOpacity
                                                    onPress={() => confirmDeleteReview(r.id)}
                                                    disabled={deletingId === r.id}
                                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                                >
                                                    {deletingId === r.id ? (
                                                        <ActivityIndicator color="#ff6b6b" size="small" />
                                                    ) : (
                                                        <Text style={styles.deleteText}>Delete</Text>
                                                    )}
                                                </TouchableOpacity>
                                            )}
                                        </View>

                                        {r.rating ? (
                                            <StarRow rating={r.rating} readOnly size={14} />
                                        ) : null}

                                        <Text style={styles.reviewItemText}>{r.review_text}</Text>
                                    </View>
                                );
                            })
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4f5d4e',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    productImage: {
        width: '100%',
        height: 380,
        backgroundColor: '#252b24',
    },
    detailsCard: {
        flex: 1,
        backgroundColor: '#05000066',
        marginHorizontal: 16,
        marginTop: 30,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ffffff22',
    },
    category: {
        color: '#aaa',
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    price: {
        color: '#62e859',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
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
    sectionLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    sizeContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 28,
    },
    sizeBox: {
        flex: 1,
        height: 44,
        backgroundColor: '#252b24',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ffffff33',
    },
    selectedSizeBox: {
        backgroundColor: '#70b56b',
        borderColor: '#70b56b',
    },
    sizeText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
    selectedSizeText: {
        color: '#050000',
        fontWeight: 'bold',
    },
    cartButton: {
        width: '100%',
        height: 52,
        backgroundColor: '#252b24',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#70b56b',
    },
    cartButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },

    reviewContainer: {
        marginTop: 20,
        backgroundColor: "#05000066",
        marginHorizontal: 16,
        borderRadius: 14,
        padding: 20,
        marginBottom: 10,
    },

    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 18,
    },

    giveReview: {
        color: "white",
        fontSize: 19,
        marginBottom: 3,
        fontFamily: "serif",
        fontWeight: '700',
    },

    help: {
        color: "#ccc",
        fontStyle: 'italic',
        fontFamily: "serif",
        fontSize: 13,
    },

    summaryBadge: {
        alignItems: 'flex-end',
    },

    summaryAvg: {
        color: '#f3fc7b',
        fontSize: 18,
        fontWeight: 'bold',
    },

    summaryCount: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 2,
    },

    composer: {
        backgroundColor: '#252b2450',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#ffffff1a',
        marginBottom: 22,
    },

    composerLabel: {
        color: '#ccc',
        fontSize: 13,
        marginBottom: 8,
        fontWeight: '600',
    },

    reviewInput: {
        width: '100%',
        minHeight: 90,
        backgroundColor: '#252b24',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: 'white',
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#ffffff33',
        textAlignVertical: 'top',
        marginTop: 14,
    },

    charCount: {
        color: '#777',
        fontSize: 11,
        textAlign: 'right',
        marginTop: 4,
        marginBottom: 12,
    },

    reviewButton: {
        width: '100%',
        height: 46,
        backgroundColor: '#252b24',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#70b56b',
    },

    reviewButtonDisabled: {
        borderColor: '#ffffff33',
        opacity: 0.5,
    },

    reviewButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },

    reviewsList: {
        width: '100%',
    },

    emptyState: {
        alignItems: 'center',
        paddingVertical: 24,
    },

    emptyEmoji: {
        fontSize: 28,
        marginBottom: 8,
    },

    noReviews: {
        color: '#aaa',
        fontStyle: 'italic',
        fontSize: 13,
        textAlign: 'center',
        paddingHorizontal: 20,
    },

    reviewItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    reviewerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#70b56b33',
        borderWidth: 1,
        borderColor: '#70b56b',
        justifyContent: 'center',
        alignItems: 'center',
    },

    avatarText: {
        color: '#70b56b',
        fontWeight: 'bold',
        fontSize: 14,
    },

    reviewAuthor: {
        color: '#70b56b',
        fontSize: 13,
        fontWeight: '700',
    },

    reviewTime: {
        color: '#888',
        fontSize: 11,
        marginTop: 1,
    },

    deleteText: {
        color: '#ff6b6b',
        fontSize: 12,
        fontWeight: '600',
    },

    reviewItemText: {
        color: 'white',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 6,
        marginBottom: 25
    },
});

export default productDetails;