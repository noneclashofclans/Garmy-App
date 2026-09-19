import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, G } from 'react-native-svg';

const FloralMotif = ({ size = 140, style, flip = false, rotate = 0 }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        style={[
            style,
            { transform: [{ scaleX: flip ? -1 : 1 }, { rotate: `${rotate}deg` }] },
        ]}
    >
        <G opacity={0.16} fill="none" stroke="#ffffff" strokeWidth={2.2}>
            
            <Path d="M100 190 C 95 150, 110 120, 100 90" />
            <Path d="M100 140 C 80 130, 65 135, 55 120" />
            <Path d="M100 120 C 122 112, 135 118, 148 105" />

            <G>
                <Circle cx="100" cy="60" r="14" fill="#ffffff" fillOpacity={0.12} />
                <Path d="M100 46 C 92 30, 78 28, 70 38 C 78 46, 90 48, 100 46 Z" fill="#ffffff" fillOpacity={0.1} />
                <Path d="M100 46 C 108 30, 122 28, 130 38 C 122 46, 110 48, 100 46 Z" fill="#ffffff" fillOpacity={0.1} />
                <Path d="M100 74 C 92 90, 78 92, 70 82 C 78 74, 90 72, 100 74 Z" fill="#ffffff" fillOpacity={0.1} />
                <Path d="M100 74 C 108 90, 122 92, 130 82 C 122 74, 110 72, 100 74 Z" fill="#ffffff" fillOpacity={0.1} />
            </G>

            <G>
                <Circle cx="55" cy="120" r="7" fill="#ffffff" fillOpacity={0.12} />
                <Path d="M40 120 C 44 112, 52 112, 55 118" />
                <Path d="M40 120 C 44 128, 52 128, 55 122" />
            </G>

            <G>
                <Circle cx="148" cy="105" r="7" fill="#ffffff" fillOpacity={0.12} />
                <Path d="M162 105 C 158 97, 150 97, 148 103" />
                <Path d="M162 105 C 158 113, 150 113, 148 107" />
            </G>
        </G>
    </Svg>
);

export default function register() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleRegister = async () => {
        if (!name || !email || !phone || !password) {
            Alert.alert("Kindly enter all the fields to continue");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://golden-back-pftn.onrender.com/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                   username: name, email: email.trim(), phone: phone.trim(), password: password
                }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Registration successful! Please log in.');
                router.push('/login');
            } else {
                Alert.alert('Registration Failed', data.message || 'Could not register user');
            }
        } catch (error) {
            Alert.alert('Connection Error', 'Unable to connect to server.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            {/* Floral styles */}
            <FloralMotif size={150} style={styles.floralTopLeft} rotate={-15} />
            <FloralMotif size={150} style={styles.floralTopRight} flip rotate={15} />
            <FloralMotif size={170} style={styles.floralBottomLeft} rotate={200} flip />
            <FloralMotif size={170} style={styles.floralBottomRight} rotate={165} />

            <Navbar />

            <View style={styles.content}>
                <Text style={styles.logo}>Register</Text>

                <Text style={styles.username}>Username</Text>

                <TextInput
                    style={styles.input}
                    placeholder="John Doe"
                    placeholderTextColor="#aaa"
                    value={name}
                    onChangeText={setName}
                    editable={!loading}
                />

                <Text style={styles.email}>Email ID</Text>

                <TextInput
                    style={styles.input}
                    placeholder="name@example.com"
                    placeholderTextColor="#aaa"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    editable={!loading}
                />
                
                <Text style={styles.phone}>Mobile number</Text>

                <TextInput
                    style={styles.input}
                    placeholder="XXXX-XXXXXX"
                    placeholderTextColor="#aaa"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    editable={!loading}
                />

                <Text style={styles.password}>Password</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading}
                />

                <Pressable 
                    style={[styles.button, loading && styles.buttonDisabled]} 
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                        <Text style={styles.buttonText}>Submit</Text>
                    )}
                </Pressable>
            </View>

            <Text style={styles.reg}>Already a user? <Text style={{ color: '#70b56b' }} onPress={() => router.push('/login')}>Login</Text> now!</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4f5d4e',
    },

    email: {
        color: "#fffffe",
        fontSize: 16,
        marginRight: "auto",
        marginLeft: 5,
        marginBottom: 3   
    },

    password: {
        color: "#fffffe",
        fontSize: 16,
        marginRight: "auto",
        marginLeft: 5,
        marginBottom: 3   
    },

    username: {
        color: "#fffffe",
        fontSize: 16,
        marginRight: "auto",
        marginLeft: 5,
        marginBottom: 3   
    },

    phone: {
        color: "#fffffe",
        fontSize: 16,
        marginRight: "auto",
        marginLeft: 5,
        marginBottom: 3   
    },
    

    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#05000066",
        margin: 10,
        marginTop: 50,
        marginBottom: 100,
        borderRadius: 31,
        paddingHorizontal: 20,
        zIndex: 1,
    },

    floralTopLeft: {
        position: 'absolute',
        top: 60,
        left: -30,
        zIndex: 0,
    },
    floralTopRight: {
        position: 'absolute',
        top: 60,
        right: -30,
        zIndex: 0,
    },
    floralBottomLeft: {
        position: 'absolute',
        bottom: 90,
        left: -40,
        zIndex: 0,
    },
    floralBottomRight: {
        position: 'absolute',
        bottom: 90,
        right: -40,
        zIndex: 0,
    },

    logo: {
        fontSize: 32,
        color: "white",
        fontWeight: "bold",
        marginBottom: 40,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#252b24',
        borderRadius: 12,
        paddingHorizontal: 16,
        color: 'white',
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ffffff33',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#445b42',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reg: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 50,
        zIndex: 1,
    },
});