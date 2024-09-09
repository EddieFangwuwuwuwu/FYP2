import React, { useState, useEffect,useContext } from 'react';
import { UserContext } from './UserContext'; 
import { Text, View, TouchableOpacity, StyleSheet, Modal, FlatList, TextInput, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchAllUsers, fetchCards, generateTOTP,fetchUsersWithSharedCards } from './api/api';

function SharingScreen() {
    const [modalOpen, setModalOpen] = useState(false);
    const [cardModalOpen, setCardModalOpen] = useState(false);
    const [totpModalOpen, setTotpModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [cards, setCards] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [TOTP, setTOTP] = useState(''); 
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [remainingTime, setRemainingTime] = useState(300); // Initial time is 5 minutes (300 seconds)
    const [usersWithSharedCards, setUsersWithSharedCards] = useState([]);  // To store the users with shared cards
    const { user } = useContext(UserContext);
    console.log('User data from context:', user);
    const userId = user?.id;

    useEffect(() => {
        if (selectedUserDetails) {
          console.log('Selected User:', selectedUserDetails);  // Logs the selected user's details
          if (selectedUserDetails.sharedCards && selectedUserDetails.sharedCards.length > 0) {
            console.log('Shared Cards:', selectedUserDetails.sharedCards);  // Logs the shared cards
          } else {
            console.log('No shared cards available');
          }
        }
      }, [selectedUserDetails]);
      
    
    useEffect(() => {
        const loadUsersWithCards = async () => {
            if (!userId) {
                console.error('userId is undefined or null');
                return;
            }
            try {
                // Fetch users that the logged-in user (Kathy) has shared cards with.
                const fetchedUsersWithSharedCards = await fetchUsersWithSharedCards(userId, 'sender'); 
                
                // Log the fetched data to inspect its structure
                console.log('Fetched Users with Shared Cards:', fetchedUsersWithSharedCards);
                
                // Check if each user object contains sharedCards
                fetchedUsersWithSharedCards.forEach(user => {
                    console.log('User:', user.username, 'Shared Cards:', user.sharedCards);  // Check if sharedCards is defined
                });
    
                // Set the users in state
                setUsersWithSharedCards(fetchedUsersWithSharedCards);
            } catch (error) {
                console.error('Error fetching users with shared cards:', error);
            }
        };
        
        loadUsersWithCards();
    }, [userId]);
    
    
    const uniqueUsersWithSharedCards = usersWithSharedCards.reduce((acc, card) => {
        if (!acc.some(user => user.id === card.id)) {
            acc.push(card);
        }
        return acc;
    }, []);


    useEffect(() => {
        if (modalOpen) {
            fetchUsers();
        }
    }, [modalOpen]);

    const fetchUsers = async () => {
        try {
            const response = await fetchAllUsers();
            setUsers(response);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchCardsForSharing = async () => {
        try {
            const response = await fetchCards();
            setCards(response);
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers([userId]);
        fetchCardsForSharing();
        setCardModalOpen(true);
    };

    const toggleCardSelection = (cardId) => {
        setSelectedCards(prevSelected => {
            if (prevSelected.includes(cardId)) {
                return prevSelected.filter(id => id !== cardId);
            } else {
                return [...prevSelected, cardId];
            }
        });
    };

    const startCountdown = () => {
        setRemainingTime(300); // Reset the timer to 5 minutes (300 seconds)
        const countdown = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(countdown);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000); // Decrement every second
    };

    const handleGenerateTOTP = async () => {
        try {
            if (selectedUsers.length === 0 || selectedCards.length === 0) {
                console.error('No users or cards selected to share.');
                return;
            }
    
            const recipientId = selectedUsers[0];  // The user Kathy is sharing the card with
            const cardId = selectedCards[0];  // The card Kathy is sharing
            const senderId = user?.id;  // Kathy’s ID
            
            // Pass both sender and recipient correctly to the backend
            const data = await generateTOTP(cardId, recipientId, senderId);
            console.log("Generated TOTP for sharing card. RecipientId:", recipientId, "SenderId:", senderId);
    
            setTOTP(data.token); 
            setTotpModalOpen(true); 
            startCountdown(); // Start the countdown when TOTP is generated
        } catch (error) {
            console.error('Error generating TOTP:', error);
        }
    };
    

    const handleShare = async () => {
        if (selectedUsers.length === 0 || selectedCards.length === 0) {
            console.error('No users or cards selected to share.');
            Alert.alert('Error', 'Please select both a user and a card to share.');
            return;
        }
    
        try {
            // Assuming 'user' contains the logged-in user's (Kathy's) information
            const senderId = user?.id;  // Kathy's ID as the sender
            const recipientId = selectedUsers[0];  // The first selected user (the recipient)
    
            // Ensure we have both senderId (Kathy) and recipientId (the selected user)
            if (!senderId || !recipientId) {
                console.error('Missing senderId or recipientId.');
                Alert.alert('Error', 'Unable to share card due to missing user information.');
                return;
            }
    
            console.log('Sharing card with the following details:');
            console.log('Sender (Kathy) ID:', senderId);
            console.log('Recipient ID:', recipientId);
            console.log('Card ID:', selectedCards[0]);
    
            // Call the handleGenerateTOTP function to generate a TOTP for sharing
            await handleGenerateTOTP(selectedCards[0], senderId, recipientId); 
    
            // If successful, close modals and reset state
            setModalOpen(false);
            setCardModalOpen(false);
            setSelectedUsers([]);
            setSelectedCards([]);
    
        } catch (error) {
            console.error('Error sharing card:', error);
            Alert.alert('Error', 'Failed to share card. Please try again.');
        }
    };
    
    const handleUserSelection = (user) => {
        console.log('Selected User:', user);  // Ensure sharedCards exists
        console.log('Shared Cards:', user.sharedCards);  // Log the shared cards data
        setSelectedUserDetails(user);
        setUserModalOpen(true);
    };
    

    const filteredUsers = users.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <View style={styles.container}>
            <Text style={styles.emptyText}>
                {usersWithSharedCards.length === 0 ? 'No users to share cards with yet.' : 'Verified Users'}
            </Text>
            <FlatList
               data={uniqueUsersWithSharedCards} 
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleUserSelection(item)} style={styles.cardItem}>
                        <Icon name="user" size={24} color={'white'} style={{ paddingHorizontal: 10 }} />
                        <Text style={styles.cardText}>{item.username}</Text>
                        <Icon name="chevron-right" size={24} color={'white'} />
                    </TouchableOpacity>
                )}
            />

            <Text style={styles.emptyText}>Select a user to share with</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalOpen(true)}>
                <Icon name="plus" size={45} color="white" />
            </TouchableOpacity>

            <Modal visible={modalOpen} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalOpen(false)}>
                            <Icon name="close" size={45} color="black" />
                        </TouchableOpacity>
                        <Icon name="users" size={100} color="#1c2633" />
                        <Text style={styles.addUserTitle}>Select Users to Share</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search user by name"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <FlatList
                            data={filteredUsers}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => toggleUserSelection(item.id)} style={styles.cardItem}>
                                    <Icon name="user" size={24} color={'white'} style={{ paddingHorizontal: 10 }} />
                                    <Text style={styles.cardText}>{item.username}</Text>
                                    <Icon
                                        name="check-circle"
                                        size={24}
                                        color={selectedUsers.includes(item.id) ? '#1b8f3a' : 'grey'}
                                    />
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            <Modal visible={cardModalOpen} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setCardModalOpen(false)}>
                            <Icon name="close" size={45} color="black" />
                        </TouchableOpacity>
                        <Icon name="credit-card" size={100} color="#1c2633" />
                        <Text style={styles.addCardTitle}>Select Cards to Share</Text>
                        <FlatList
                            data={cards}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => toggleCardSelection(item.id)} style={styles.cardItem}>
                                    <Icon name="credit-card" size={24} color={'white'} style={{ paddingHorizontal: 10 }} />
                                    <Text style={styles.cardText}>{item.card_number}</Text>
                                    <Icon
                                        name="check-circle"
                                        size={24}
                                        color={selectedCards.includes(item.id) ? '#1b8f3a' : 'grey'}
                                    />
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={styles.addCardButton} onPress={handleShare}>
                            <Text style={styles.addButtonText}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={totpModalOpen} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setTotpModalOpen(false)}>
                            <Icon name="close" size={45} color="black" />
                        </TouchableOpacity>
                        <Icon name="lock" size={100} color="#1c2633" />
                        <Text style={styles.totpTitle}>Generated TOTP Code:</Text>
                        <Text style={styles.totpCode}>{TOTP}</Text>
                        
                        <Text style={styles.countdownText}>
                            Code expires in: {Math.floor(remainingTime / 60)}:{('0' + (remainingTime % 60)).slice(-2)}
                        </Text>
                    </View>
                </View>
            </Modal>

            <Modal visible={userModalOpen} animationType="slide" transparent={true}>
  <View style={styles.modalOverlay}>
    <View style={styles.userModalContent}>
      <TouchableOpacity style={styles.closeButton} onPress={() => setUserModalOpen(false)}>
        <Icon name="close" size={45} color="black" />
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <Icon name="user" size={100} color="#1c2633" />
      </View>
      <Text style={styles.addUserTitle}>User Details</Text>
      {selectedUserDetails && (
        <View style={styles.userDetailsContainer}>
          <Text style={styles.label}>Username: {selectedUserDetails.username}</Text>
          <Text style={styles.label}>Email: {selectedUserDetails.email}</Text>
          <Text style={styles.label}>Shared Cards:</Text>
          <FlatList
            data={selectedUserDetails.sharedCards}
            keyExtractor={(item) => item.card_id.toString()}
            renderItem={({ item }) => (
              <Text style={styles.sharedCards}>
                {item.bank_type} - {item.card_number}
              </Text>
            )}
          />
        </View>
      )}
    </View>
  </View>
</Modal>

        </View>
    );
}

export default SharingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    emptyText: {
        color: 'lightgrey',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '50%',
        fontSize: 24,
        fontFamily: 'Poppins-SemiBold',
    },
    addButton: {
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
    modalContent: {
        width: '100%',
        backgroundColor: '#f7f7f7',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        maxWidth: 400,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginRight: 10,
        marginTop: 10,
    },
    searchInput: {
        width: '100%',
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        fontFamily: 'Poppins-Regular',
    },
    cardItem: {
        flexDirection: 'row',
        width: "100%",
        height: 60,
        borderRadius: 100,
        backgroundColor: '#1c2633',
        marginVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardText: {
        fontSize: 18,
        fontFamily: 'Poppins-Regular',
        color: 'white',
        paddingHorizontal: 10,
    },
    addUserTitle: {
        fontSize: 20,
        justifyContent: 'center',
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 20,
        color: '#1c2633',
        textAlign: 'center',
    },
    addCardTitle: {
        fontSize: 20,
        justifyContent: 'center',
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 20,
        color: '#1c2633',
        textAlign: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    addCardButton: {
        backgroundColor: '#1c2633',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: '100%',
    },
    totpTitle: {
        fontSize: 20,
        justifyContent: 'center',
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 20,
        color: '#1c2633',
        textAlign: 'center',
    },
    totpCode: {
        fontSize: 30,
        fontFamily: 'Poppins-SemiBold',
        color: '#e63946',
        textAlign: 'center',
    },
    countdownText: {  // New style for countdown
        fontSize: 18,
        fontFamily: 'Poppins-Regular',
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
    label: {
        fontSize: 18,
        marginVertical: 5,
        fontFamily: 'Poppins-Regular',
    },
    sharedCards: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: 'black',
    },

    userModalContent: {
        width: '100%',
        maxHeight: '80%',
        backgroundColor: '#f7f7f7',
        borderRadius: 10,
        padding: 20,
        maxWidth: 400,
        flex: 1,
        justifyContent: 'flex-start',
    },
    iconContainer: {
        alignItems: 'center',  // Center the icon horizontally
        marginBottom: 20,  // Add space between the icon and the title
    },
    userDetailsContainer: {
        width: '100%',
        marginTop: 20,
        maxHeight: '60%',
        flexGrow: 1,
        flexDirection: 'column',
        overflow: 'scroll',
    },
      

});
