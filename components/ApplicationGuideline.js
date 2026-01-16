import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function ApplicationGuideline() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Application Guideline</Text>
            <Text style={styles.text}>
                Follow these steps to use the application:
            </Text>
            <Text style={styles.subheading}>Register and Login:</Text>
            <Text style={styles.bulletPoint}>- Users need to register by providing an email, username, and password.</Text>
            <Text style={styles.bulletPoint}>- Log in using your credentials to access the app.</Text>

            <Text style={styles.subheading}>Adding Banking Cards:</Text>
            <Text style={styles.bulletPoint}>- Click on "Add Card" and fill in the card details.</Text>

            <Text style={styles.subheading}>Creating Categories:</Text>
            <Text style={styles.bulletPoint}>- Organize your cards by creating custom categories.</Text>

            <Text style={styles.subheading}>Sharing Cards:</Text>
            <Text style={styles.bulletPoint}>- Securely share cards with others using TOTP two-factor authentication.</Text>
        </View>
    );
}

export default ApplicationGuideline;

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
