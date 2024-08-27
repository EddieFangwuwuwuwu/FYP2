import React, { useState, useEffect, useContext } from 'react';
import { Image, Text, View, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import { updateProfileInfo, updateProfilePicture, fetchUserProfile } from '../components/api/api';
import { UserContext } from '../components/UserContext';

function AccInfoScreen() {
    const [photo, setPhoto] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, setUser } = useContext(UserContext);

    const baseURL = 'http://10.0.2.2:8082';

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const userData = await fetchUserProfile();
                if (userData.profile_picture) {
                    const fullUrl = `${baseURL}${userData.profile_picture}`;
                    setPhoto({ uri: fullUrl });
                }
                setUsername(userData.username);
                setEmail(userData.email);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        loadUserProfile();
    }, []);

    const selectAndCropPhoto = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            includeBase64: true,
        })
        .then(image => {
            setPhoto({
                uri: image.path,
                type: image.mime,
                name: image.filename || `cropped_${Date.now()}.jpg`,
            });
        })
        .catch(error => {
            if (error.code !== 'E_PICKER_CANCELLED') {
                console.error('ImagePicker Error: ', error);
            }
        });
    };

    const handleUpdateProfileInfo = async () => {
        try {
            const response = await updateProfileInfo({ username, email, password });
            if (response.message) {
                Alert.alert('Success', 'Profile info updated successfully');
                setUser(prevUser => ({ ...prevUser, username, email }));
            }
        } catch (error) {
            console.error('Error updating profile info:', error);
            Alert.alert('Error', 'Failed to update profile info');
        }
    };

    const handleUpdateProfilePicture = async () => {
        try {
            const formData = new FormData();
            formData.append('profile_picture', {
                uri: photo.uri,
                type: photo.type,
                name: photo.name,
            });

            const response = await updateProfilePicture(formData);
            if (response.message) {
                Alert.alert('Success', 'Profile picture updated successfully');
                const updatedProfilePictureUrl = `${baseURL}${response.profile_picture}`;
                setUser(prevUser => ({ ...prevUser, profilePicture: updatedProfilePictureUrl }));
            }
        } catch (error) {
            console.error('Error updating profile picture:', error);
            Alert.alert('Error', 'Failed to update profile picture');
        }
    };

    const handleSubmit = async () => {
        await handleUpdateProfileInfo();
        if (photo && !photo.uri.startsWith('http')) {
            await handleUpdateProfilePicture();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Account</Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text style={{ marginLeft: 20, fontFamily: 'Poppins-SemiBold', marginRight: 80 }}>Photo</Text>
                <View style={{ flexDirection: 'column' }}>
                    {photo ? (
                        <Image
                            source={{ uri: photo.uri }}
                            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 20 }}
                        />
                    ) : (
                        <Avatar.Image source={require("../Image/profile.jpg")} size={100} />
                    )}
                    <TouchableOpacity style={{ marginTop: 30 }} onPress={selectAndCropPhoto}>
                        <Text style={{ fontFamily: 'Poppins-Regular', color: '#00c2ae' }}>Upload Image</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.textInputContainer}>
                    <Icon name="user" size={24} style={styles.icon} />
                    <TextInput
                        placeholder='Enter your new username'
                        style={styles.textInput}
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.emailLabel}>Email</Text>
                <View style={styles.textInputContainer}>
                    <Icon name="mail" size={24} style={styles.icon} />
                    <TextInput
                        placeholder='Enter your new email'
                        style={styles.textInput}
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.textInputContainer}>
                    <Icon name="lock" size={24} style={styles.icon} />
                    <TextInput
                        placeholder='Enter your new password'
                        style={styles.textInput}
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit Changes</Text>
            </TouchableOpacity>
        </View>
    );
}

export default AccInfoScreen;

const styles = StyleSheet.create({
    title: {
        fontSize: 40,
        fontFamily: 'Poppins-SemiBold',
        justifyContent: 'flex-start',
        color: "#1c2633"
    },
    container: {
        marginTop: 50,
        flex: 1,
        paddingHorizontal: 20
    },
    row: {
        flexDirection: 'row',
        marginTop: 30,
        justifyContent: 'flex-start',
    },
    label: {
        marginLeft: 20,
        marginTop: 15,
        fontFamily: 'Poppins-SemiBold',
        marginRight: 30
    },
    emailLabel: {
        marginLeft: 20,
        marginTop: 15,
        fontFamily: 'Poppins-SemiBold',
        marginRight: 62
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 25,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: '70%'
    },
    icon: {
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        height: 50,
    },
    submitButton: {
        backgroundColor: '#1c2633',
        borderWidth: 1,
        borderRadius: 20,
        height: 50,
        marginTop: 20
    },
    submitText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        padding: 10,
        fontFamily: "Poppins-SemiBold"
    }
});
