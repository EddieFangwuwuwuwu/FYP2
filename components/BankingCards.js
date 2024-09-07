import React, { useContext, useState, useEffect } from 'react';
import { Avatar } from 'react-native-paper';
import { Text, View, TouchableOpacity, StyleSheet, Modal, FlatList, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddCardsForm from "./AddBankCardsForm";
import { fetchCards, verifyTOTP, checkPendingVerification, fetchPendingSharedCards,fetchVerifiedSharedCards } from './api/api';
import { UserContext } from './UserContext'; 
import ImageModal from './profileImage/ImageModal';

function BankingCardsScreen({ navigation, route, searchQuery = '' }) {
  const { user } = useContext(UserContext); 
  const userId = user?.id;
  const username = user?.username || "Guest";
  const [verifiedSharedCards, setVerifiedSharedCards] = useState([]); // New state for verified shared cards
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingCards, setPendingCards] = useState([]); // Pending cards state
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [totpModalOpen, setTotpModalOpen] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [totpError, setTotpError] = useState(''); // To store TOTP errors
  const [remainingTime, setRemainingTime] = useState(300);

  useEffect(() => {
    const loadData = async () => {
      await loadCards(); 
      await loadVerifiedSharedCards(); // Load verified shared cards initially
    };

    loadData(); 
}, []);

  
  // New useEffect to handle pending verification only after pendingCards is updated
  useEffect(() => {
    if (pendingCards.length > 0) {
      handlePendingVerification();  // Run the verification check only after pendingCards is populated
    }
  }, [pendingCards]);  // This will trigger when pendingCards state changes

  
  
  const loadCards = async () => {
    try {
      // Fetch cards owned by the user
      const fetchedCards = await fetchCards();
  
      // Fetch cards that are shared with the user (some might be unverified)
      const sharedCards = await fetchPendingSharedCards();
  
      console.log("Shared cards fetched:", sharedCards); // Log shared cards
  
      // Filter out only the verified shared cards (assumes sharedCards have an `is_verified` flag)
      const verifiedSharedCards = sharedCards.filter(card => card.is_verified);
  
      // Fetch owned cards (owned by the current user)
      const userCards = fetchedCards.filter(card => card.user_id === userId); // User's own cards
  
      // Set owned cards to the state
      setCards(userCards);
  
      // Set verified shared cards to the state
      setVerifiedSharedCards(verifiedSharedCards);  // <-- This is the key part you're missing
  
      // Handle case where no verified cards are found
      if (userCards.length === 0 && verifiedSharedCards.length === 0) {
        console.warn('No cards found for user:', userId);
      }
  
      // Store unverified shared cards (those waiting for verification)
      const pendingVerificationCards = sharedCards.filter(card => !card.is_verified);
      setPendingCards(pendingVerificationCards);  // Store pending cards for later verification
  
      // Log the pending cards for debugging
      console.log("Pending cards set:", pendingVerificationCards);
  
    } catch (error) {
      // Catch any errors and log them
      console.error('Failed to fetch cards:', error);
    }
  };

  const addCard = async (newCard) => {
    setCards((prevCards) => {
      const updatedCards = [...prevCards, newCard];
      return updatedCards;
    });
    setModalOpen(false); 
    try {
      await loadCards(); 
    } catch (error) {
      console.error('Failed to load cards:', error);
    }
  };

  const filteredCards = cards.filter(card =>
    card.bank_type && card.bank_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAvatarPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };


const loadVerifiedSharedCards = async () => {
  try {
    const verifiedShared = await fetchVerifiedSharedCards(userId);
    console.log("Verified shared cards fetched:", verifiedShared);  // Check if the fetched cards contain full details
    
    // Check if the fetched data contains necessary card details (bank_type, card_number, etc.)
    if (verifiedShared.length > 0 && verifiedShared[0].bank_type) {
      setVerifiedSharedCards(verifiedShared);  // Only set if data is valid
    } else {
      console.warn('Fetched verified shared cards, but missing card details.');
    }
  } catch (error) {
    console.error('Error fetching verified shared cards:', error);
  }
};



const handleVerifyTOTP = async () => {
  if (!selectedCard) {
      Alert.alert('Error', 'No card selected for verification.');
      return;
  }

  try {
      console.log('Sending TOTP verification request with:');
      console.log('Card ID:', selectedCard.id);
      console.log('User ID:', userId);
      console.log('TOTP Code:', totpCode);

      const response = await verifyTOTP(selectedCard.id, userId, totpCode);
      
      // Log the response from the backend
      console.log('Received response from verifyTOTP API:', response);

      if (response.success) {
          console.log('TOTP verification successful.');
          Alert.alert('Success', 'Card sharing verified successfully!');
          
          setTotpModalOpen(false);
          setTotpCode('');
          setTotpError('');

          // Reload both owned cards and verified shared cards after verification
          await loadCards();
          await loadVerifiedSharedCards();  // <-- Ensure shared cards are reloaded
      } else {
          console.log('TOTP verification failed. Received response:', response);
          setTotpError('Invalid TOTP code. Please try again.');
      }
  } catch (error) {
      console.error('Error verifying TOTP:', error);
      Alert.alert('Error', 'Failed to verify TOTP. Please try again.');
  }
};


  const handlePendingVerification = async () => {
    try {
      const verificationResponse = await checkPendingVerification();
      console.log('Verification response:', verificationResponse);
  
      if (verificationResponse && verificationResponse.pending !== undefined) {
        if (verificationResponse.pending) {
          const { card_id } = verificationResponse.data;
          console.log('card_id from pending verification:', card_id);
  
          // Match card_id with the correct field in pendingCards
          const pendingCard = pendingCards.find(card => card.id === card_id);
          if (pendingCard) {
            setSelectedCard(pendingCard); // Set the selected pending card
            setTotpModalOpen(true);
            startCountdown();
          } else {
            console.error('Pending card not found in pendingCards');
          }
        }
      } else {
        console.log('No pending verification or unexpected structure.');
      }
    } catch (error) {
      console.error('Error checking pending verification:', error);
    }
  };

  const startCountdown = () => {
    setRemainingTime(300); // Reset the timer to 5 minutes (300 seconds)
    const countdown = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(countdown);
          setTotpError('TOTP code has expired. Please request a new one.'); // Handle expiration
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Decrement every second
  };


  return (
    <View style={styles.container}>
      <View style={styles.userSection}>
        <TouchableOpacity onPress={handleAvatarPress}>
          {user?.profilePicture ? (
            <Avatar.Image source={{ uri: user.profilePicture }} size={100} style={styles.avatar} />
          ) : (
            <Avatar.Image source={require("../Image/profile.jpg")} size={100} style={styles.avatar} />
          )}
        </TouchableOpacity>
        <View style={{ flexDirection: 'column', marginTop: 10, marginLeft: 15 }}>
          <Text style={{ fontSize: 20 }}>Welcome</Text>
          <Text style={styles.userName}>{username || "Guest"}</Text> 
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.smallButton} onPress={() => setModalOpen(true)}>
          <Icon name="credit-card" size={20} color="#1c2633" />
          <Text style={styles.buttonText}>add card</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton}>
          <Icon name="folder-o" size={20} color="#1c2633" />
          <Text style={styles.buttonText}>create category</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton}>
          <Icon name="user-plus" size={20} color="#1c2633" />
          <Text style={styles.buttonText}>sharing account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton}>
          <Icon name="cogs" size={20} color="#1c2633" />
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      
<Text style={styles.title}>My cards</Text>
<FlatList
  data={cards}  // Cards owned by the user
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity 
      style={styles.items}
      onPress={() => {
        setSelectedCard(item);
        setDetailModalOpen(true);
      }}
    >
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


<Text style={styles.title}>Shared cards</Text>
<FlatList
  data={verifiedSharedCards}  // Verified shared cards
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity 
      style={styles.items}
      onPress={() => {
        setSelectedCard(item);
        setDetailModalOpen(true);
      }}
    >
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
            <AddCardsForm userId={userId} addCard={addCard} />
          </View>
        </View>
      </Modal>

      <Modal
        visible={detailModalOpen}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setDetailModalOpen(false)}>
              <Icon name="close" size={45} color="black" />
            </TouchableOpacity>
            <Icon name="credit-card" size={100} color="#1c2633" />
            <Text style={styles.addCardTitle}>Card Details</Text>
            {selectedCard && (
              <View>
                <Text style={styles.label}>Bank Type: {selectedCard.bank_type}</Text>
                <Text style={styles.label}>Card Number: {selectedCard.card_number}</Text>
                <Text style={styles.label}>Card Type: {selectedCard.card_type}</Text>
                <Text style={styles.label}>Expiration Date: {new Date(selectedCard.expiration_date).toDateString()}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <ImageModal 
        visible={isModalVisible} 
        onClose={handleCloseModal} 
        imageUri={user?.profilePicture || '../Image/profile.jpg'} 
      />


<Modal
        visible={totpModalOpen}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setTotpModalOpen(false)}>
              <Icon name="close" size={45} color="black" />
            </TouchableOpacity>
            <Icon name="lock" size={100} color="#1c2633" />
            <Text style={styles.totpTitle}>Enter TOTP Code</Text>
            <TextInput
              style={styles.totpInput}
              placeholder="Enter TOTP Code"
              value={totpCode}
              onChangeText={setTotpCode}
              keyboardType="numeric"
            />
            {totpError ? <Text style={styles.errorText}>{totpError}</Text> : null} 
            <Text style={styles.countdownText}>Time remaining: {Math.floor(remainingTime / 60)}:{('0' + remainingTime % 60).slice(-2)}</Text>
            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyTOTP}>
              <Text style={styles.verifyTOTPButtonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


    </View>
  );
}

export default BankingCardsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
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
    margin: 10,
  },
  userName: {
    fontSize: 30,
    fontFamily: 'Poppins-SemiBold',
    color: '#1c2633',
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
    fontSize: 30,
    margin: 30,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
  items: {
    flexDirection: 'row',
    width: '100%',
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
    paddingLeft: 20,
  },
  subname: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    paddingLeft: 20,
  },
  icon: {
    marginLeft: 20,
    marginTop: 2,
    marginRight: 10,
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
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 20,
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
    marginBottom: 20,
    color: '#1c2633',
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    fontFamily: 'Poppins-Regular',
  },
  totpInput: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },
  verifyButton: {
    backgroundColor: '#1c2633',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});



