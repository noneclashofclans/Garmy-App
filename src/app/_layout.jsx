import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <AuthProvider>
            <CartProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <AnimatedSplashOverlay />
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="login" />
                        <Stack.Screen name="choosePage" />
                        <Stack.Screen name="mens" />
                        <Stack.Screen name="womens" />
                        <Stack.Screen name="boys" />
                        <Stack.Screen name="girls" />
                        <Stack.Screen name="productDetails" />
                        <Stack.Screen name="cart" />
                    </Stack>
                </ThemeProvider>   
            </CartProvider>       
        </AuthProvider>           
    );
}