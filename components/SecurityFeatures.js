import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function SecurityFeature() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Security Features</Text>
            <Text style={styles.text}>
                Our application uses industry-standard security features such as TOTP two-factor authentication, 
                encrypted card storage, and secure communication protocols to protect user data.
            </Text>
            <Text style={styles.subheading}>Key Features:</Text>
            <Text style={styles.bulletPoint}>- Encrypted TOTP code for sharing cards.</Text>
            <Text style={styles.bulletPoint}>- Secure password storage with hashing.</Text>
            <Text style={styles.bulletPoint}>- SSL/TLS for all communication.</Text>
        </View>
    );
}

export default SecurityFeature;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    title: {
        fontSize: 30,
        fontWeight: '600',
        fontFamily: "Poppins-SemiBold",
        color: '#1c2633', // Dark color for consistency
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: 'grey',
        marginBottom: 20,
    },
    subheading: {
        fontSize: 18,
        fontFamily: "Poppins-SemiBold",
        color: '#1c2633',
        marginBottom: 10,
    },
    bulletPoint: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: '#1c2633',
        marginBottom: 10,
    },
});
