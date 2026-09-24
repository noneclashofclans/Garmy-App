import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Image } from 'react-native'; 
import { useRouter, usePathname } from 'expo-router';
import userAvatar from '../../assets/images/user.jpg';

const Navbar = ({ user, onLogout }) => {
    const router = useRouter();
    const path = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const isLoginActive = path === '/login';
    const isRegisterActive = path === '/register';

    const getUserDisplayName = () => {
        if (!user) return '';
        if (typeof user === 'string') return user;
        return user.name || user.username || user.email?.split('@')[0] || 'User';
    };

    return (
        <View style={styles.navbarContainer}>
            {/* Logo */}
            <Text style={styles.logoText} onPress={() => router.push('/')}>GARMY</Text>

            <View style={styles.buttonMain}>
                {user ? (
                    <>
                        
                        <TouchableOpacity
                            onPress={() => setDropdownOpen(true)}
                            style={styles.profileTrigger}
                            activeOpacity={0.7}
                        >
                            <Image source={userAvatar} style={styles.avatarImage} />
                        </TouchableOpacity>

                        <Modal
                            visible={dropdownOpen}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setDropdownOpen(false)}
                        >
                            <TouchableWithoutFeedback onPress={() => setDropdownOpen(false)}>
                                <View style={styles.modalOverlay}>
                                    <TouchableWithoutFeedback>
                                        <View style={styles.dropdownMenu}>
                                            <View style={styles.dropdownHeader}>
                                                <Text style={styles.dropdownName} numberOfLines={1}>
                                                    {getUserDisplayName()}
                                                </Text>
                                                {user.email && <Text style={styles.dropdownEmail}>{user.email}</Text>}
                                            </View>

                                            <View style={styles.dropdownDivider} />

                                            <TouchableOpacity 
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    setDropdownOpen(false);
                                                    router.push('/cart');
                                                }}
                                            >
                                                <Text style={{ color: "white", fontSize: 14 }}>🛒 Cart</Text>
                                            </TouchableOpacity>
                                            
                                              <View style={styles.dropdownDivider} />

                                            <TouchableOpacity
                                                style={[styles.dropdownItem, styles.logoutItem]}
                                                onPress={() => {
                                                    setDropdownOpen(false);
                                                    onLogout();
                                                }}
                                            >
                                                <Text style={styles.logoutText}>  Logout</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                    </>
                ) : (
                    <>
                        <TouchableOpacity
                            onPress={() => router.push('/login')}
                            style={[styles.tabButton, isLoginActive && styles.activeTab]}
                        >
                            <Text style={[styles.buttonText, isLoginActive && styles.activeText]}>Login</Text>
                        </TouchableOpacity>

                        <Text style={styles.divider}>|</Text>

                        <TouchableOpacity
                            onPress={() => router.push('/register')}
                            style={[styles.tabButton, isRegisterActive && styles.activeTab]}
                        >
                            <Text style={[styles.buttonText, isRegisterActive && styles.activeText]}>Register</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    navbarContainer: {
        width: '100%',
        backgroundColor: '#2c3a2b41',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        zIndex: 10,
    },
    logoText: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontFamily: 'serif',
    },
    buttonMain: {
        marginLeft: 'auto',
        backgroundColor: '#252b24b6',
        paddingVertical: 4,
        paddingHorizontal: 10,
        gap: 6,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 9,
    },
    tabButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: '#12161186',
    },
    divider: {
        color: 'white',
        opacity: 0.6,
    },
    buttonText: {
        color: '#ccc',
        fontSize: 15,
        fontWeight: '500',
    },
    activeText: {
        color: 'white',
        fontWeight: '700',
    },
    logoutText: {
        color: '#ff6b6b',
        fontSize: 14,
        fontWeight: '600',
    },
    profileTrigger: {
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: 35,
        height: 35,
        borderRadius: 15,
        resizeMode: 'cover',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    dropdownMenu: {
        position: 'absolute',
        top: 55,
        right: 16, 
        backgroundColor: '#252b24f5', 
        borderRadius: 10,
        paddingVertical: 6,
        minWidth: 150,
        borderWidth: 1,
        borderColor: '#70b56b40',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    dropdownHeader: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    dropdownName: {
        color: '#70b56b',
        fontSize: 16,
        fontWeight: '600',
    },
    dropdownEmail: {
        color: '#ccc',
        fontSize: 14,
        marginTop: 2,
    },
    dropdownDivider: {
        height: 1,
        backgroundColor: '#ffffff15',
        marginVertical: 4,
    },
    dropdownItem: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    logoutItem: {
        marginTop: 2,
    }
});

export default Navbar;
