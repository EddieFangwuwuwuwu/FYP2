import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { saveReminderSettings } from '../components/api/api';  // Import the function from your API file

function EditExpireDate({ userId, navigation }) {
    const [reminderPeriod, setReminderPeriod] = useState('30');  // Default to 30 days

    const handleSaveReminderSettings = async () => {
        try {
            await saveReminderSettings(userId, reminderPeriod);  // Use the API function with only reminderPeriod
            Alert.alert('Success', 'Settings updated successfully!');
        } catch (error) {
            Alert.alert('Failed to update settings.');
            console.error('Error updating reminder settings:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Card Expiration Date</Text>

            
            <Icon name="credit-card" size={100} color="#1c2633" style={styles.icon} />

           
            <View style={styles.row}>
                <Text style={styles.label}>Reminder Time</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={reminderPeriod}
                        onValueChange={(value) => setReminderPeriod(value)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Before 2 weeks" value="15" />
                        <Picker.Item label="Before 1 Month" value="30" />
                        <Picker.Item label="Before 3 Months" value="90" />
                    </Picker>
                </View>
            </View>

            
            <View style={styles.bottom}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSaveReminderSettings}>
                    <Text style={styles.submitText}>Submit Changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 40,
        fontFamily: 'Poppins-SemiBold',
        justifyContent: 'flex-start',
        color: "#1c2633",
        textAlign: 'center',
        marginBottom: 30,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'flex-start',  // Ensure content is at the top
    },
    row: {
        marginTop: 30,
        justifyContent: 'flex-start',
    },
    label: {
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 10,
        fontSize: 18,
        color: '#1c2633',
        marginLeft:20
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 25,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#f4f4f4',
    },
    picker: {
        color: '#1c2633',
        flex: 1,
    },
    icon: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',  // Push the button to the bottom
        marginBottom: 40,  // Add space between button and bottom of the screen
    },
    submitButton: {
        backgroundColor: '#1c2633',
        borderWidth: 1,
        borderRadius: 20,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        fontFamily: "Poppins-SemiBold"
    },
});

export default EditExpireDate;
