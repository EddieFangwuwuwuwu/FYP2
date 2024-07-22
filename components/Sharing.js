import React,{useState} from "react";
import {Text,View,TouchableOpacity,StyleSheet,Modal} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

function SharingScreen(){
  const [modalOpen, setModalOpen] = useState(false);
    return(
            <View style={styles.container}>
            <Text style={styles.emptyText}>No user to shared account yet</Text>
        <TouchableOpacity style={styles.addcategory} onPress={() => setModalOpen(true)}>
        <Icon name="plus" size={45} color="white" />
        </TouchableOpacity>
        <Modal
        visible={modalOpen}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalOpen(false)}>
              <Icon name="close" size={45} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

      modalContent: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center'
      },
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      closeButton: {
        alignSelf: 'flex-end',
        marginRight: 10,
        marginTop: 10,
      },

})

export default SharingScreen;
