import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Avatar, Title } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from './UserContext';
import ImageModal from './profileImage/ImageModal';
import { useNavigation } from '@react-navigation/native';

function Setting() {
    const navigation = useNavigation();
    const { user } = useContext(UserContext);
    const [isModalVisible, setModalVisible] = useState(false);

    const handleAvatarPress = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleAvatarPress}>
                {user?.profilePicture ? (
                    <Avatar.Image source={{ uri: user.profilePicture }} size={100} style={styles.avatar} />
                ) : (
                    <Avatar.Image source={require("../Image/profile.jpg")} size={100} style={styles.avatar} />
                )}
            </TouchableOpacity>
            <View style={{ flexDirection: 'column', marginTop: 20 }}></View>
            <Title style={styles.username}>{user?.username || "Guest"}</Title>
            <TouchableOpacity style={styles.option} onPress={() => { navigation.navigate('Account Information'); }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.optionText}>Account Information</Text>
                    <Icon name="chevron-right" size={45} color="#1c2633" style={styles.iconRight} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={() => { navigation.navigate('Edit Expiration Date'); }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.optionText}>Edit Card Expiration Date</Text>
                    <Icon name="chevron-right" size={45} color="#1c2633" style={styles.iconRight} />
                </View>
            </TouchableOpacity>

            <ImageModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                imageUri={user?.profilePicture || require('../Image/profile.jpg')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    avatar: {
        borderRadius: 50,
        width: 100,
        height: 100,
        resizeMode: 'cover',
        justifyContent: 'center',
        marginLeft: 155
    },
    container: {
        marginTop: 50,
        flex: 1,
    },
    username: {
        fontSize: 30,
        color: 'black',
        textAlign: 'center',
        marginBottom: 50,
        fontFamily: "Poppins-SemiBold",
        paddingVertical: 10
    },
    option: {
        borderWidth: 0.5,
        borderColor: 'black',
        padding: 20,
    },
    optionText: {
        marginTop: 10,
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold'
    },
    iconRight: {
        marginLeft: 130
    }
});

export default Setting;
