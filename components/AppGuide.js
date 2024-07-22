import React from "react";
import {Text,View,TouchableOpacity,StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function AppGuideScreen(){
    return(
        <View style={styles.container}>
            <TouchableOpacity style={styles.option}>
                <Icon name='book' size={45} color='white' style={styles.icon} />
                <Text style={styles.optionTitle}>Application Guideline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option}>
                <Icon name='shield' size={45} color='white' style={styles.icon} />
                <Text style={styles.optionTitle}>Security Features</Text>
                </TouchableOpacity>
        </View>
    )

}

const styles= StyleSheet.create({

    container:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center'
    },

    option:{
        backgroundColor:'#1c2633',
        justifyContent:'center',
        width:'90%',
        borderRadius:5,
        height:100,
        marginLeft:18,
       flexDirection:'row',
       marginBottom:50,
       
    },

    optionTitle:{
    fontSize: 25,
    margin: 30,
    fontFamily: "Kanit-Bold",
    color: "white",
    },

    icon:{
        alignItems:'center',
        justifyContent:'center',
        marginLeft:15,
        marginTop:28,
    }
})

export default AppGuideScreen;
