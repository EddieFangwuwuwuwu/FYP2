import React, { useState } from 'react';
import { Avatar } from 'react-native-paper';
import { Text, View, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddCardsForm from "./AddBankCardsForm";

function BankingCardsScreen({ searchQuery }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [cards, setCards] = useState([
    { cardName: 'Hong Leong', cardNumber: '17099877118', cardType: 'Credit Card', expirationDate: '12/24' },
    { cardName: 'Public Bank', cardNumber: '57300099557', cardType: 'Debit Card', expirationDate: '11/23' },
  ]);

  const user = {
    name: "Eddie",
    profilePicture: require('../Image/profile.jpg')
  };

  const addCard = (newCard) => {
    setCards([...cards, newCard]);
    setModalOpen(false); // Close the modal after adding the card
  };

  const filteredCards = cards.filter(card =>
    card.cardName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.userSection}>
        <Avatar.Image source={user.profilePicture} size={70} style={styles.userAvatar} />
        <View style={{ flexDirection: 'column', marginTop: 10, marginLeft: 15 }}>
          <Text style={{ fontSize: 20 }}>Welcome</Text>
          <Text style={styles.userName}>{user.name}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.smallButton}>
          <Icon name="exchange" size={20} color="#1c2633" />
          <Text style={styles.buttonText}>Transfer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton}>
          <Icon name="credit-card" size={20} color="#1c2633" />
          <Text style={styles.buttonText}>Withdraw</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton}>
          <Icon name="line-chart" size={20} color="#1c2633" />
          <Text style={styles.buttonText}>Insights</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton}>
          <Icon name="cogs" size={20} color="#1c2633" />
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>My cards</Text>
      <FlatList
        data={filteredCards}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.items}>
            <View style={styles.itemContent}>
              <Icon name="credit-card" size={45} color="white" style={styles.icon} />
              <View style={styles.textcontainer}>
                <Text style={styles.name}>{item.cardName}</Text>
                <Text style={styles.subname}>{item.cardNumber}</Text>
              </View>
              <Icon name="chevron-right" size={45} color="white" style={styles.iconRight} />
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.addcards} onPress={() => setModalOpen(true)}>
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
            <Icon name="credit-card" size={100} color="#1c2633" />
            <Text style={styles.addCardTitle}>Add New Card</Text>
            <AddCardsForm addCard={addCard} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  userSection: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 10,
    left: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 15,
  },
  userAvatar: {
    margin: 10
  },
  userName: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#f4f4f4'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginVertical: 10,
    width: '90%',
    borderRadius: 10,
    right:15,
    paddingVertical: 10,
  },
  smallButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '21%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 15,
    marginHorizontal: 15
  },
  buttonText: {
    color: '#1c2633',
    fontSize: 12,
    marginTop: 5,
  },
  title: {
    fontSize: 50,
    margin: 30,
    fontFamily: "Kanit-Bold",
    color: "black"
  },
  items: {
    flexDirection: 'row',
    marginLeft: 18,
    width: "92%",
    height: 60,
    borderRadius: 100,
    backgroundColor: '#1c2633',
    marginVertical: 10,
  },
  name: {
    color: 'white',
    paddingTop: 0,
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 20
  },
  subname: {
    color: 'white',
    fontSize: 15,
    paddingLeft: 20
  },
  icon: {
    marginLeft: 20,
    marginTop: 2,
    marginRight: 10
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconRight: {
    marginLeft: 130,
  },
  textcontainer: {
    flexDirection: 'column'
  },
  addcards: {
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
    backgroundColor: '#f7f7f7',
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
  addCardTitle: {
    fontSize: 24,
    justifyContent: 'center',
    fontWeight: 'bold',
    marginBottom: 20
  },
});

export default BankingCardsScreen;
