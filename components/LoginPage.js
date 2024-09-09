import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { loginUser, fetchUserProfile } from './api/api';
import { UserContext } from './UserContext';

function LoginPage() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(UserContext);

    const handleLogin = async () => {
        try {
            const response = await loginUser({ email, password });
            if (response.user) {
                const { id, username } = response.user;
    
                try {
                    const userProfile = await fetchUserProfile();
                    setUser({
                        id,
                        username,
                        profilePicture: userProfile.profile_picture 
                            ? `http://10.0.2.2:8082${userProfile.profile_picture}`
                            : null,
                    });
    
                    // Navigate to the home screen
                    navigation.reset({
                        index: 0,
                        routes: [{
                            name: 'Drawer',
                            params: {
                                screen: 'DrawerHome',
                                params: {
                                    screen: 'BankingCards',
                                    params: { userId: id, username },
                                },
                            },
                        }],
                    });
                } catch (error) {
                    console.error('Error fetching user profile or cards:', error);
                    Alert.alert('Error', 'Failed to load user data.');
                }
            } else {
                Alert.alert('Login failed', 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login Error:', error);
            Alert.alert('Login Error', 'Something went wrong. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    source={require('../Image/logo.png')}
                />
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Log in to your account</Text>
            </View>
            <View style={styles.textInputContainer}>
                <Icon name="user" size={24} style={styles.icon} />
                <TextInput 
                    placeholder='Enter your email'
                    value={email}
                    onChangeText={setEmail}
                    style={styles.textInput}
                />
            </View>
            <View style={styles.textInputContainer}>
                <Icon name="lock" size={24} style={styles.icon} />
                <TextInput 
                    placeholder='Enter your password'
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={styles.textInput}
                />
            </View>
           
            <View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>
            </View>

            
            <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account?</Text>
                <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default LoginPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100,
        paddingHorizontal: 20,
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40, // Increased space to balance layout
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    titleContainer: {
        alignItems: 'flex-start',
        marginBottom: 30,
    },
    title: {
        fontSize: 30,
        fontWeight: '600',
        fontFamily: "Poppins-SemiBold",
        color: 'black',
    },
    subtitle: {
        fontSize: 18,
        fontFamily: "Poppins-Regular",
        color: 'grey',
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 25,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: '100%',
    },
    icon: {
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        height: 50,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: 'black',
        fontFamily: "Poppins-Regular",
    },
    button: {
        backgroundColor: '#1c2633',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        marginBottom: 40, // More space after the button
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: "Poppins-SemiBold",
    },
    signUpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20, // Increased padding for balance
    },
    signUpText: {
        marginHorizontal: 5,
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
    },
    signUpButtonText: {
        fontFamily: 'Poppins-Regular',
        color: 'black',
        fontSize: 16,
    },
});
