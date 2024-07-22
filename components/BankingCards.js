import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddCardsForm from "./AddBankCardsForm";

function BankingCardsScreen() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cards, setCards] = useState([
    { id: '1', bank: 'Hong Leong', number: '******118' },
    { id: '2', bank: 'Public Bank', number: '******557' },
  ]);
  const [search, setSearch] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);

  const addCard = (newCard) => {
    setCards([...cards, newCard]);
  };

  const searchCards = (text) => {
    setSearch(text);
    if (text) {
      const newData = cards.filter(item => {
        const itemData = item.bank ? item.bank.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredCards(newData);
    } else {
      setFilteredCards([]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My cards</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        value={search}
        onChangeText={(text) => searchCards(text)}
      />
      <FlatList
        data={search ? filteredCards : cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.items}>
            <View style={styles.itemContent}>
              <Icon name="credit-card" size={45} color="white" style={styles.icon} />
              <View style={styles.textcontainer}>
                <Text style={styles.name}>{item.bank}</Text>
                <Text style={styles.subname}>{item.number}</Text>
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
            <AddCardsForm addCard={addCard} closeModal={() => setModalOpen(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#f4f4f4'
  },
  title: {
    fontSize: 50,
    margin: 30,
    fontFamily: "Kanit-Bold",
    color: "black"
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 20,
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
