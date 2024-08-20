import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from './api/api';
import { UserContext } from './UserContext'; // Import UserContext

function LoginPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext); // Access setUser from context

  const handleLogin = async () => {
    try {
      const response = await loginUser({ email, password });
      if (response.user) {
        const { id, username } = response.user;
        setUser({ id, username }); // Update the global state with user information
        console.log('Navigating to Drawer with:', { userId: id, username }); 
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
      } else {
        Alert.alert('Login failed', 'Invalid credentials');
      }
    } catch (error) {
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
      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.orText}>or continue with</Text>
      <View style={styles.googleContainer}>
        <TouchableOpacity style={styles.google}>
          <Image source={require("../Image/google.jpg")} style={styles.googleLogo}/>
          <Text style={styles.googleText}>Google</Text>
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
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  orText: {
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 20,
    fontFamily: 'Poppins-Regular',
  },
  googleContainer: {},
  google: {
    borderRadius: 25,
    borderWidth: 1,
    textAlign: 'center',
    paddingHorizontal: 10,
    alignItems: 'center',
    borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  googleText: {
    color: 'black',
    fontSize: 15,
    fontFamily
: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 2,
    paddingLeft: 5,
    paddingVertical: 10,
  },
  googleLogo: {
    width: 24,
    height: 24,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  signUpText: {
    marginHorizontal: 5,
    fontFamily: 'Poppins-Regular',
  },
  signUpButton: {
    bottom: 1,
  },
  signUpButtonText: {
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
});
