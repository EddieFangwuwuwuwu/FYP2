import React from 'react';
import { View, Text, StyleSheet, TextInput,TouchableOpacity,Image } from 'react-native';
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
        <Text style={{fontSize:15,textAlign:'center',paddingVertical:20}}>or continue with</Text>
        <View style={styles.googleContainer}>
          <TouchableOpacity style={styles.google}>
            <Image source={require("../Image/google.jpg")} style={styles.googleLogo}/>
            <Text style={styles.googleText}>Google</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Don't have an account?</Text>
          <TouchableOpacity style={styles.signInButton}>
            <Text style={{fontFamily:'Poppins-Regular',fontWeight:'bold'}}>Sign In</Text>
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
   fontFamily: "Poppins-SemiBold",
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
    padding:10,
    fontFamily:"Poppins-SemiBold"
  },
  googleContainer:{

  },
  google:{
    borderRadius:25,
    borderWidth:1,
    textAlign:'center',
    paddingHorizontal:10,
    alignItems:'center',
    borderColor:'black',
    flexDirection:'row',
    justifyContent:'center'
  },
  googleText:{
    color:'black',
    fontSize:15,
    fontFamily:'Poppins-Regular',
    textAlign:'center',
    marginTop:2,
    paddingLeft:5,
    paddingVertical:10,
  },
  googleLogo:{
    width:24,
    height:24
  },
  signInContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    paddingVertical:10,
   
  },
  signInText:{
    marginHorizontal:5,
    fontFamily:'Poppins-Regular',
  },
  signInButton:{
   bottom:2
  }
});
