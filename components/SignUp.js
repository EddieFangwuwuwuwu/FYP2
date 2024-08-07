import React from 'react';
import { View, Text, StyleSheet, TextInput,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

function SignUpPage() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Let's get</Text>
        <Text style={styles.title}>Started</Text>
      </View>
      <View style={styles.textInputContainer}>
        <Icon name="mail" size={24} style={styles.icon} />
        <TextInput 
          placeholder='Enter your email'
          style={styles.textInput}
        />
      </View>
      <View style={styles.textInputContainer}>
        <Icon name="user" size={24} style={styles.icon} />
        <TextInput 
          placeholder='Enter your username'
          style={styles.textInput}
        />
      </View>
      <View style={styles.textInputContainer}>
        <Icon name="lock" size={24} style={styles.icon} />
        <TextInput 
          placeholder='Enter your password'
          secureTextEntry
          style={styles.textInput}
        />
      </View>
      <View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

export default SignUpPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'flex-start',
    marginBottom: 50,
  },
  title: {
    fontSize: 40,
    fontWeight: '400',
   fontFamily: "Poppins-ThinItalic",
    color: 'black',
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

  button:{
    backgroundColor:'#1c2633',
    borderRadius:25
  },
  buttonText:{
    color:'white',
    fontSize:20,
    textAlign:'center',
    padding:10
  }
});
