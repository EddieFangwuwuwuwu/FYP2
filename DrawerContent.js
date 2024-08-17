import React, { useEffect } from "react";
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Avatar, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

const DrawerList= [
    { icon: 'credit-card', label: 'Banking Cards', navigateTo: 'BankingCards' },
    { icon: 'folder', label: 'Category', navigateTo: 'Category' },
    { icon: 'users', label: 'Sharing', navigateTo: 'Sharing' },
    { icon: 'book', label: 'Application Guideline', navigateTo: 'AppGuide' }
];

const DrawerItemComponent = ({ icon, label, navigateTo }) => {
    const navigation = useNavigation();
    return (
        <DrawerItem 
            icon={({ color, size }) => <Icon name={icon} color="#1c1c1c" size={size} />}
            labelStyle={{ color: "#1c1c1c", fontSize: 14, fontFamily: "Poppins-Medium" }}
            label={label}
            onPress={() => { navigation.navigate(navigateTo); }}
        />
    );
};

const DrawerItems = () => {
    return DrawerList.map((item, index) => (
        <DrawerItemComponent
            key={index}
            icon={item.icon}
            label={item.label}
            navigateTo={item.navigateTo}
        />
    ));
};

function DrawerContent(props) {
  const navigation2 = useNavigation();
  const { username = "Guest" } = props; // Get username from props

  useEffect(() => {
    console.log('Username in DrawerContent:', username);
  }, [username]);

  const handleSignOut = () => {
      // Show confirmation alert before signing out
      Alert.alert(
          "Logging out",
          "Are you sure you want to log out?",
          [
              {
                  text: "No",
                  onPress: () => console.log("Logout cancelled"),
                  style: "cancel"
              },
              {
                  text: "Yes",
                  onPress: () => {
                      // Reset navigation stack and navigate to Login screen
                      navigation2.reset({
                          index: 0,
                          routes: [{ name: 'Login' }], // Adjust this based on your route name for the login screen
                      });
                  }
              }
          ],
          { cancelable: false }
      );
  };

  return (
      <View style={styles.drawerContent}>
          <DrawerContentScrollView {...props}>
              <View style={styles.drawerContent}>
                  <TouchableOpacity activeOpacity={0.8}>
                      <View style={styles.userInfoSection}>
                          <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 15 }}>
                              <Avatar.Image source={require("./Image/profile.jpg")} size={50} style={{ marginTop: 5 }} />
                              <View style={{ marginLeft: 10, flexDirection: 'column' }}>
                                  <Title style={styles.title}>{username}</Title>
                              </View>
                          </View>
                      </View>
                  </TouchableOpacity> 
                  <DrawerItems />
              </View>
          </DrawerContentScrollView>
          <DrawerItem
              icon={({ color, size }) => (
                  <Icon name="gear" color="#1c1c1c" size={size} />
              )}
              labelStyle={{ color: "#1c1c1c", fontSize: 15, fontFamily: "Poppins-Medium" }}
              label="Setting" 
              onPress={() => {
                  navigation2.navigate('Setting')
              }}
          />
          <DrawerItem
              icon={({ color, size }) => (
                  <Icon name="sign-out" color="#1c1c1c" size={size} />
              )}
              labelStyle={{ color: "#1c1c1c", fontSize: 15, fontFamily: "Poppins-Medium" }}
              label="Sign Out" 
              onPress={handleSignOut}
          />
      </View>
  );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        color: "#1c1c1c",
        fontSize: 20,
        marginTop: 12,
        marginLeft: 8,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 13,
        lineHeight: 14,
        width: '100%',
    },
});

export default DrawerContent;
