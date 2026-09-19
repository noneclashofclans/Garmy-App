import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native'

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const logout = () => {
        Alert.alert(
            'Log out?',
            'Do you really want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        setUser(null);
                        Alert.alert('You have been logged out successfully');
                    },
                },
            ]
        );
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);