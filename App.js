import 'react-native-gesture-handler';
import React, { useState } from 'react';
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
import SearchBarAnimation from './components/Search/SearchBarAnimation';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUp';

const StackNav = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const renderHeaderRight = () => (
    <SearchBarAnimation 
      onClose={() => setSearchVisible(false)} 
      onOpen={() => setSearchVisible(true)} 
      onChangeText={setSearchQuery} 
    />
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#1c1c1c",
        headerStyle: { backgroundColor: "#f5f5f5" },
        contentStyle: { backgroundColor: "#f5f5f5" },
        headerLeft: () => (
          <Icon name="bars" size={30} color="#1c1c1c" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
        ),
      }}>
      <Stack.Screen 
        name="BankingCards" 
        options={{
          headerTitle: searchVisible ? '' : 'BankingCards',
          headerRight: renderHeaderRight,
        }} 
      >
        {props => <BankingcardsScreen {...props} searchQuery={searchQuery} />}
      </Stack.Screen>
      <Stack.Screen 
        name="Category" 
        options={{
          headerTitle: searchVisible ? '' : 'Category',
          headerRight: renderHeaderRight,
        }} 
      >
        {props => <CategoryScreen {...props} searchQuery={searchQuery} />}
      </Stack.Screen>
      <Stack.Screen name="AppGuide" component={AppGuideScreen} />
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
    //<NavigationContainer>
     // <DrawerNav />
    //</NavigationContainer>
   < LoginPage/>
    //<SignUpPage/>
  );
}

export default App;
