import React, { useState, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';  // Import FontAwesome icon library

const InAppNotification = ({ cardType, cardNumber, expiredDate, visible, onClick, onClose }) => {
    const [slideAnim] = useState(new Animated.Value(-100)); // Initial position off-screen

    useEffect(() => {
        if (visible) {
            // Slide the notification in
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();

            // Auto-hide after 3 seconds
            setTimeout(() => {
                Animated.timing(slideAnim, {
                    toValue: -100,
                    duration: 500,
                    useNativeDriver: true,
                }).start(() => {
                    if (onClose) {
                        onClose();
                    }
                });
            }, 5000);
        }
    }, [visible]);

    return (
        <Animated.View style={[styles.notificationContainer, { transform: [{ translateY: slideAnim }] }]}>
            <TouchableOpacity onPress={onClick} style={styles.notificationContent}>
                
                <Icon name="credit-card" size={24} color="#1c2633" style={styles.icon} />
                
                
                <Text style={styles.notificationText}>
                    Your {cardType} : {cardNumber} will expire at {expiredDate}. Kindly check your banking card.
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    notificationContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: '#f7f7f7',
        padding: 15,
        elevation: 10,
    },
    notificationContent: {
        flexDirection: 'row', // Align icon and text horizontally
        alignItems: 'center', // Vertically center the items
        justifyContent: 'flex-start', // Align items to the start
    },
    icon: {
        marginRight: 10,  // Space between icon and text
    },
    notificationText: {
        color: '#1c2633',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        flexShrink: 1,  // Ensure text wraps properly if too long
    },
});

export default InAppNotification;
