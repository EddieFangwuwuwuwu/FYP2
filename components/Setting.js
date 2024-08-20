import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React , {useContext}from 'react';
import {View,StyleSheet,Text} from 'react-native';
import { Avatar,Title } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from './UserContext';

function Setting(){

   const navigation= useNavigation();
   const { user } = useContext(UserContext);

    return(
        <View style={styles.container}>
            <Avatar.Image source={require("../Image/profile.jpg")} size={100} style={{marginLeft:150,justifyContent:'center'}}/>
            <View style={{flexDirection:'column',marginTop:20}}></View>
            <Title style={styles.username}>{user?.username || "Guest"}</Title>
            <TouchableOpacity style={styles.option} onPress={()=>{navigation.navigate('accInfo')}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={styles.optionText}>Account Information</Text>
                <Icon name="chevron-right" size={45} color="#1c2633" style={styles.iconRight} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={()=>{navigation.navigate('EditExpireDate')}}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={styles.optionText}>Edit Card Expration Date</Text>
                <Icon name="chevron-right" size={45} color="#1c2633" style={styles.iconRight} />
                </View>
            </TouchableOpacity>

            

        </View>
    )

}

const styles=StyleSheet.create({
    container:{
        marginTop:50,
        flex:1,
    },

    username:{
        fontSize:30,
        color:'black',
        textAlign:'center',
        marginBottom:50,
        fontFamily:"Poppins-SemiBold",
        paddingVertical:10
        
    },

    option:{
        
        borderWidth:0.5,
        bordercolor:'black',
        padding:20,
    },

    optionText:{
        marginTop:10,
        color:'black',
        fontSize:20,
        fontWeight:'bold'
    },

    iconRight:{
        marginLef:130
    }

    
})
export default Setting;