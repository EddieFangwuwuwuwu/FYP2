import React from 'react';
import { View, StyleSheet, Image,Text,TextInput,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';

function LoginPage() {
  return (
    <View>
    <View style={styles.logo_container}>
      <Image
        style={styles.logo}
        source={require('../Image/logo.png')}
      />
    </View>
    <View style={styles.container}>
        <Text style={styles.login_header}>Login</Text>
        <View style={styles.textfield}>
        <Icon name='user' color='#1c2633' style={styles.smallicon}/>
        <TextInput placeholder='Enter username' style={styles.textinput}/>
    </View>
    <View style={styles.textfield}>
        <Icon name='lock1' color='#1c2633' style={styles.smallicon2}/>
        <TextInput placeholder='Enter password' style={styles.textinput}/>
    </View>
    </View>
    <View style={{justifyContent:'flex-end',alignItems:'flex-end',marginRight:35}}>
<Text style={{fontWeight:700}}>Forgot password</Text>
    </View>
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <View>
        <Text style={{padding:10,marginRight:30,fontWeight:700}}>
          ----- Or continue as ---------
        </Text>
      </View>
    </View>
    <View style={styles.bottomButtonContainer}>
      <TouchableOpacity style={styles.bottomButton}>
        <FeatherIcon name='user-plus' color='white' style={styles.bottomButtonIcon}></FeatherIcon>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomButton}>
        <Icon name='google' color='white' style={styles.bottomButtonIcon}></Icon>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomButton}>
        <Icon name='facebook-square' color='white' style={styles.bottomButtonIcon}></Icon>
      </TouchableOpacity>
    </View>
    <View style={styles.bottomButtonLabel}>
      <Text style={styles.bottomButtonLabelText}>Sign Up</Text>
      <Text style={styles.bottomButtonLabelText}>Google</Text>
      <Text style={styles.bottomButtonLabelText}>Facebook</Text>
    </View>
    
    </View>
  );
}

const styles = StyleSheet.create({
  logo_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container:{
    alignItems:'center',
    marginTop:-5
  },
  logo: {
    width: 300, // Adjust the width as needed
    height: 300, // Adjust the height as needed
    marginRight:50,
    marginTop:80
  },

  login_header:{
    marginBottom:10,
    fontSize:40,
    fontWeight:'bold',
    color:'#1c2633',
  },

  textfield:{
    borderRadius:50,
    borderWidth: 1,
    flexDirection:'row',
    borderColor:'#1c2633',
    width: '90%',
    marginBottom:10
  },

  textinput:{
    flex:1
  },

  smallicon:{
    marginRight:10,
    marginLeft:10,
    fontSize:45
  },
  smallicon2:{
    marginTop:5,
    marginRight:15,
    marginLeft:10,
    fontSize:40
  },
  buttonContainer:{
    alignItems:'center',
    justifyContent:'center',
    marginLeft:40
  },
  button:{
    marginTop:10,
    marginRight:50,
    backgroundColor:'#1c2633',
    width:'80%',
    borderRadius:50,
    height:50,
     alignItems:'center',
    justifyContent:'center'
  },
  buttonText:{
    color:'white',
    fontWeight:'700',
    fontSize:18
  },
  bottomButtonContainer:{
    flexDirection:'row',
    marginLeft:20,
    justifyContent:'space-between',
    paddingTop:10,
    marginRight:20,
    paddingLeft:30,
    paddingRight:30
  },
  bottomButton:{
    backgroundColor:'#1c2633',
    width:80,
    height:80,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center'
  },
  bottomButtonIcon:{
    fontSize:40
  },
  bottomButtonLabel:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingLeft:40,
    paddingRight:35,
    marginLeft:25,
    marginRight:20
  },
  bottomButtonLabelText:{
    fontSize:15,
    fontWeight:'500',
    color:'grey'
  }

});

export default LoginPage;
