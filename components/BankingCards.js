import React, { useContext, useState, useEffect } from 'react';
import { Avatar } from 'react-native-paper';
import { Text, View, TouchableOpacity, StyleSheet, Modal, FlatList, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddCardsForm from "./AddBankCardsForm";
import { fetchCards, verifyTOTP, checkPendingVerification, fetchPendingSharedCards,fetchVerifiedSharedCards } from './api/api';
import { UserContext } from './UserContext'; 
import ImageModal from './profileImage/ImageModal';
import InAppNotification from './InAppNotification';

function BankingCardsScreen({ navigation, route, searchQuery = '' }) {
  const { user } = useContext(UserContext); 
  const senderId = user?.id;  // Assuming 'user' comes from UserContext and contains the user's ID
  const [selectedUserId, setSelectedUserId] = useState(null); // Selected recipient (user to share the card with)
  const recipientId = selectedUserId;  // Get this ID from the selected user (the recipient)  
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
  const [showNotification, setShowNotification] = useState(false);
  const [cardType, setCardType] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiredDate, setExpiredDate] = useState('');
  const [myCardsModalVisible, setMyCardsModalVisible] = useState(false);
  const [sharedCardsModalVisible, setSharedCardsModalVisible] = useState(false);
  

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
  
      // Ensure 'user' is defined and fetch owned cards (owned by the current user)
      const userCards = fetchedCards.filter(card => card.user_id === user?.id); // Use user?.id from UserContext
  
      // Set owned cards to the state
      setCards(userCards);
  
      // Set verified shared cards to the state
      setVerifiedSharedCards(verifiedSharedCards); 
  
      // Handle case where no verified or owned cards are found
      if (userCards.length === 0 && verifiedSharedCards.length === 0) {
        console.warn('No cards found for user:', user?.id);
      }


      const expiringCards = userCards.filter(card => {
        const expirationDate = new Date(card.expiration_date);
        const today = new Date();
        const daysDiff = (expirationDate - today) / (1000 * 3600 * 24);
        return daysDiff <= 30;  // Adjust this to use the reminder period
    });

    if (expiringCards.length > 0) {
        const { card_type, card_number, expiration_date } = expiringCards[0];  // First expiring card

        // Set card details for the notification
        setCardType(card_type);
        setCardNumber(card_number);
        setExpiredDate(expiration_date);
        setShowNotification(true);  // Show the notification
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
      const verifiedShared = await fetchVerifiedSharedCards(user?.id);
      console.log("Verified shared cards fetched:", verifiedShared);  // Check if the fetched cards contain full details
      
      // Check if the fetched data is valid and contains necessary card details
      if (Array.isArray(verifiedShared) && verifiedShared.length > 0 && verifiedShared[0].bank_type) {
        setVerifiedSharedCards(verifiedShared);  // Only set if data is valid
      } else if (verifiedShared.length === 0) {
        console.warn('No verified shared cards found for this user.');
        setVerifiedSharedCards([]);  // Clear the state if no cards are found
      } else {
        console.warn('Fetched verified shared cards, but missing card details.');
        setVerifiedSharedCards([]);  // Clear the state if data is invalid
      }
    } catch (error) {
      console.error('Error fetching verified shared cards:', error);
      setVerifiedSharedCards([]);  // Clear the state if there was an error
    }
  };
  
  const handleVerifyTOTP = async () => {
    if (!selectedCard) {
        Alert.alert('Error', 'No card selected for verification.');
        return;
    }

    const recipientId = user?.id;  // Eddie's ID (the current logged-in user)

    if (!recipientId) {
        Alert.alert('Error', 'No recipient selected.');
        return;
    }

    try {
        console.log('Sending TOTP verification request with:', {
            cardId: selectedCard.id,
            recipientId,  // Correct recipient (Eddie)
            totpCode      // TOTP code entered by Eddie
        });

        // No need to send `senderId` from the frontend, the backend will retrieve it
        const response = await verifyTOTP(selectedCard.id, recipientId, totpCode);

        if (response.success) {
            Alert.alert('Success', 'Card sharing verified successfully!');
            
            // Reset TOTP modal and related states
            setTotpModalOpen(false);
            setTotpCode('');
            setTotpError('');
            
            // Reset selectedCard and recipientId to prepare for future actions
            setSelectedCard(null);
            setSelectedUserId(null);  // Assuming you're tracking selected user for sharing
            
            // Reload cards to reflect any new changes
            await loadCards();
            await loadVerifiedSharedCards();
        } else {
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

<InAppNotification
          cardType={cardType}
          cardNumber={cardNumber}
          expiredDate={expiredDate}  // Pass the expiration date to the notification
          visible={showNotification}
          onClick={() => setShowNotification(false)}  // Hide notification when clicked
          onClose={() => setShowNotification(false)}  // Automatically hide after 3 seconds
        />

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
        <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Category')}>
          <Icon name="folder-o" size={20} color="#1c2633" />
          <Text style={styles.buttonText}>Create Category</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Sharing')}>
          <Icon name="user-plus" size={20} color="#1c2633" />
          <Text style={styles.buttonText}>Sharing Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Setting')}>
          <Icon name="cogs" size={20} color="#1c2633" />
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>


      {cards.length > 0 && (
        <TouchableOpacity style={styles.cardShape} onPress={() => setMyCardsModalVisible(true)}>
          <Text style={styles.cardText}>My Cards</Text>
          <Icon name="chevron-right" size={30} color="white" style={styles.iconRight} />
        </TouchableOpacity>
      )}

<Modal
  visible={myCardsModalVisible}
  animationType="slide"
  transparent={true}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <TouchableOpacity style={styles.closeButton} onPress={() => setMyCardsModalVisible(false)}>
        <Icon name="close" size={45} color="black" />
      </TouchableOpacity>
      <Text style={styles.modalTitle}>My Cards</Text>

      <FlatList
        data={cards}  // Cards owned by the user
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.modalItem}  // Updated card style
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
    </View>
  </View>
</Modal>




{verifiedSharedCards.length > 0 && (
  <TouchableOpacity style={styles.cardShape} onPress={() => setSharedCardsModalVisible(true)}>
    <Text style={styles.cardText}>Shared Cards</Text>
    <Icon name="chevron-right" size={30} color="white" style={styles.iconRight} />
  </TouchableOpacity>
)}

<Modal
  visible={sharedCardsModalVisible}
  animationType="slide"
  transparent={true}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <TouchableOpacity style={styles.closeButton} onPress={() => setSharedCardsModalVisible(false)}>
        <Icon name="close" size={45} color="black" />
      </TouchableOpacity>
      <Text style={styles.modalTitle}>Shared Cards</Text>
      
      <FlatList
        data={verifiedSharedCards}  // Verified shared cards
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.modalItem}  // Updated card style for shared cards
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
    </View>
  </View>
</Modal>

      
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
            <AddCardsForm userId={user?.id} addCard={addCard} />
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
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  subname: {
    fontSize: 16,
    color: 'white',
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
    width: '90%',
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
  verifyTOTPButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },

  countdownText:{
    color: 'black',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  cardShape: {
    backgroundColor: '#1c2633', // Dark background
    borderRadius: 20, // Rounded corners like a card
    paddingVertical: 30,
    paddingHorizontal: 20,
    height: 130,
    marginVertical: 30,
    width: '90%',
    alignSelf: 'center', // Center the card horizontally
    shadowColor: '#000', // Shadow for 3D effect
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12, // Elevation for Android shadow
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    color: 'white', // Text color
    fontSize: 20, // Larger text for emphasis
    fontFamily: 'Poppins-SemiBold',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1c2633',  // Darker title color
  },

  modalItem: {
    backgroundColor: '#1c2633',  // Dark card color
    borderRadius: 15,
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconRight: {
    marginLeft: 'auto',
  },
});



