import 'react-native-gesture-handler';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import BankingcardsScreen from './components/BankingCards';
import CategoryScreen from './components/Category';
import AppGuideScreen from './components/AppGuide';
import SharingScreen from './components/Sharing';
import Setting from './components/Setting';
import DrawerContent from './DrawerContent';
import AccInfoScreen from './SettingScreen/AccInfoScreen';
import EditExpireDate from './SettingScreen/EditExpireDate';

const StackNav = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#1c1c1c",
        headerStyle: { backgroundColor: "#f5f5f5" },
        contentStyle: { backgroundColor: "#f5f5f5" },
        headerLeft: () => {
          return (
            <Icon name="bars" size={30} color="#1c1c1c" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
          );
        }
      }}>
      <Stack.Screen name="BankingCards" component={BankingcardsScreen} />
      <Stack.Screen name="AppGuide" component={AppGuideScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="Sharing" component={SharingScreen} />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="accInfo" component={AccInfoScreen} />
      <Stack.Screen name="EditExpireDate" component={EditExpireDate}/>
    </Stack.Navigator>
  );
};

const DrawerNav = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false
      }}>
      <Drawer.Screen name="DrawerHome" component={StackNav} />
    </Drawer.Navigator>
  );
};

function App() {
  return (
    <NavigationContainer>
      <DrawerNav />
    </NavigationContainer>
  );
}

export default App;
