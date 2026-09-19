import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

const Navbar = ({ user, onLogout }) => {
    const router = useRouter();
    const path = usePathname();

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

            {/* Auth Actions Container */}
            <View style={styles.buttonMain}>
                {user ? (
                    <>
                        <Text style={styles.userNameText} numberOfLines={1}>
                            {getUserDisplayName()}
                        </Text>
                        <Text style={styles.divider}>|</Text>
                        <TouchableOpacity 
                            onPress={onLogout}
                            style={styles.tabButton}
                        >
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                        <Text style={styles.divider}>|</Text>

                        <TouchableOpacity onPress={() => router.push('/cart')}>
                            <Text style={{color: "white", fontSize: 20}}>🛒 <Text style={{fontSize: 15}}>Cart</Text></Text>
                        </TouchableOpacity>
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
    userNameText: {
        color: '#70b56b',
        fontSize: 14,
        fontWeight: '600',
        maxWidth: 110,
    },
    logoutText: {
        color: '#ff6b6b',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default Navbar;