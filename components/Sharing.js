import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Modal, FlatList, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchAllUsers, fetchCards, generateTOTP, fetchVerifiedUsers } from './api/api';

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
    const [verifiedUsers, setVerifiedUsers] = useState([]);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [remainingTime, setRemainingTime] = useState(300); // Initial time is 5 minutes (300 seconds)

    useEffect(() => {
        const fetchVerifiedUsersData = async () => {
            try {
                const verifiedUsers = await fetchVerifiedUsers();
                setVerifiedUsers(verifiedUsers);
            } catch (error) {
                console.error('Error handling in fetchVerifiedUsersData:', error);
            }
        };

        fetchVerifiedUsersData();
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
            const data = await generateTOTP(selectedCards[0], selectedUsers[0]);
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
            return;
        }
        try {
            await handleGenerateTOTP(); 
            setModalOpen(false);
            setCardModalOpen(false);
            setSelectedUsers([]);
            setSelectedCards([]);
        } catch (error) {
            console.error('Error sharing card:', error);
        }
    };

    const handleUserSelection = (user) => {
        setSelectedUserDetails(user);
        setUserModalOpen(true);
    };

    const filteredUsers = users.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <View style={styles.container}>
            <Text style={styles.emptyText}>
                {verifiedUsers.length === 0 ? 'No users to share cards with yet.' : 'Verified Users'}
            </Text>
            <FlatList
                data={verifiedUsers}
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
                        {/* Countdown Timer */}
                        <Text style={styles.countdownText}>
                            Code expires in: {Math.floor(remainingTime / 60)}:{('0' + (remainingTime % 60)).slice(-2)}
                        </Text>
                    </View>
                </View>
            </Modal>

            <Modal visible={userModalOpen} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setUserModalOpen(false)}>
                            <Icon name="close" size={45} color="black" />
                        </TouchableOpacity>
                        <Icon name="user" size={100} color="#1c2633" />
                        <Text style={styles.addUserTitle}>User Details</Text>
                        {selectedUserDetails && (
                            <View>
                                <Text style={styles.label}>Username: {selectedUserDetails.username}</Text>
                                <Text style={styles.label}>Email: {selectedUserDetails.email}</Text>
                                <Text style={styles.label}>Shared Cards:</Text>
                                <Text style={styles.sharedCards}>{selectedUserDetails.sharedCards}</Text>
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
        color: 'grey',
    },
});
