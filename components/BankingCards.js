import React, { useState, useEffect } from 'react';
import { Avatar } from 'react-native-paper';
import { Text, View, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddCardsForm from "./AddBankCardsForm";
import { fetchCards } from './api/api';  // Import your fetchCards function

function BankingCardsScreen({ navigation, route, searchQuery = '' }) {
  const [username, setUsername] = useState(route.params?.username || "Guest");
  const [modalOpen, setModalOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  useEffect(() => {
    if (route.params?.username) {
      setUsername(route.params.username);
      navigation.setParams({ username: route.params.username });
    }
  }, [route.params?.username]);

  // Fetch cards from the API
  const loadCards = async () => {
    try {
        const fetchedCards = await fetchCards();
        console.log('Fetched Cards:', fetchedCards); // Log the fetched data
        setCards(fetchedCards);
    } catch (error) {
        console.error('Failed to fetch cards:', error);
    }
  };

  useEffect(() => {
    loadCards(); // Load cards when the component is mounted
  }, []);

  const addCard = (newCard) => {
    setCards([...cards, newCard]);
    setModalOpen(false);
  };

  const filteredCards = cards.filter(card =>
    card.bank_type && card.bank_type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.userSection}>
        <Avatar.Image source={require('../Image/profile.jpg')} size={70} style={styles.userAvatar} />
        <View style={{ flexDirection: 'column', marginTop: 10, marginLeft: 15 }}>
          <Text style={{ fontSize: 20 }}>Welcome</Text>
          <Text style={styles.userName}>{username || "Guest"}</Text> 
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.smallButton}>
          <Icon name="exchange" size={20} color="#1c2633" />
          <Text style={styles.buttonText}>add card</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton}>
          <Icon name="credit-card" size={20} color="#1c2633" />
          <Text style={styles.buttonText}>create category</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton}>
          <Icon name="line-chart" size={20} color="#1c2633" />
          <Text style={styles.buttonText}>sharing account</Text>
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
                <Text style={styles.name}>{item.bank_type}</Text>  
                <Text style={styles.subname}>{item.card_number}</Text>
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

export default BankingCardsScreen;

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
    fontFamily: "Poppins-SemiBold",
    color: '#1c2633'
  },
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    width: '100%',
    borderRadius: 10,
    paddingVertical: 10,
  },
  smallButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '22%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 15,
  },
  buttonText: {
    color: '#1c2633',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Poppins-Regular',
  },
  title: {
    fontSize: 50,
    margin: 30,
    fontFamily: "Poppins-SemiBold",
    color: "black"
  },
  items: {
    flexDirection: 'row',
    width: "100%",
    height: 60,
    borderRadius: 100,
    backgroundColor: '#1c2633',
    marginVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  name: {
    color: 'white',
    paddingTop: 0,
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    paddingLeft: 20
  },
  subname: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
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
    flex: 1,
  },
  iconRight: {
    position: 'absolute',
    right: 20,
  },
  textcontainer: {
    flexDirection: 'column',
    flex: 1,
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
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 20
  },
});
