import React from "react";
import {Text,View,TouchableOpacity,StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

function SharingScreen(){
    return(
            <View style={styles.container}>
            <Text style={styles.emptyText}>No user to shared account yet</Text>
        <TouchableOpacity style={styles.addcategory} onPress={() => setModalOpen(true)}>
        <Icon name="plus" size={45} color="white" />
        </TouchableOpacity>
        </View>
    )

}


const styles= StyleSheet.create({

    container: {
        flex: 1,
        padding: 0,
        backgroundColor: '#f4f4f4'
      },

      emptyText:{
        color:'lightgrey',
        textAlign:'center',
        alignItems:'center',
        justifyContent:'center',
        marginTop:'50%',
        fontSize:40
      },

    addcategory: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#1c2633',
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
      },

})

export default SharingScreen;
