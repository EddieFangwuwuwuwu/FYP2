import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Modal, FlatList, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchCardsForCategory , addCardsToCategory, fetchCards } from './api/api';  // Import necessary API functions

function CategoryaddCards({ route, navigation }) {
    const { category } = route.params;  // Access the selected category from navigation params
    const [modalOpen, setModalOpen] = useState(false);
    const [availableCards, setAvailableCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryCards, setCategoryCards] = useState([]);

    // Fetch cards associated with the selected category
    const loadCategoryCards = async () => {
        try {
            const cards = await fetchCardsForCategory(category.id); // Fetch cards related to the category
           
    
            // Directly assign the fetched cards to categoryCards state
            setCategoryCards(cards);
    
            // Since `fetchCardsForCategory` fetches cards already in the category, 
            // for `availableCards`, you'd need to fetch all cards and exclude those that are already in the category.
            const allCards = await fetchCards(); // Fetch all cards for the user
            
    
            // Filter cards that are not yet associated with the current category
            const notAssociatedCards = allCards.filter(card => !cards.some(c => c.id === card.id));
            
    
            setAvailableCards(notAssociatedCards);
        } catch (error) {
            console.error('Failed to load category cards:', error);
        }
    };
    

    useEffect(() => {
        loadCategoryCards(); // Load category cards when the screen is loaded
    }, []);

    const toggleCardSelection = (cardId) => {
        if (selectedCards.includes(cardId)) {
            setSelectedCards(selectedCards.filter(id => id !== cardId));
        } else {
            setSelectedCards([...selectedCards, cardId]);
        }
    };

    const handleAddCardsToCategory = async () => {
        if (selectedCards.length === 0) {
            console.error('No cards selected to add.');
            return;  // Exit the function early if no cards are selected
        }
    
        try {
            await addCardsToCategory(category.id, selectedCards);  // Pass category.id and selectedCards correctly
            setModalOpen(false);
            setSelectedCards([]);
            await loadCategoryCards(); // Refresh the category cards to reflect the changes
        } catch (error) {
            console.error('Failed to add cards to category:', error);
        }
    };
    
    const filteredCards = availableCards.filter(card =>
        card.card_number && card.card_number.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {categoryCards.length === 0 ? (
                <Text style={styles.emptyText}>No Cards in this Category</Text>
            ) : (
                <FlatList
                    data={categoryCards}  
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.cardItem}>
                            <Text style={styles.cardText}>{item.card_number}</Text>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity style={styles.addButton} onPress={() => setModalOpen(true)}>
                <Icon name="plus" size={45} color="white" />
            </TouchableOpacity>

            <Modal visible={modalOpen} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalOpen(false)}>
                            <Icon name="close" size={45} color="black" />
                        </TouchableOpacity>
                        <Icon name="credit-card" size={100} color="#1c2633" />
                        <Text style={styles.addCardTitle}>Add Cards to {category?.cateName}</Text>
                        <TextInput
                            placeholder="Search card number"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={styles.searchInput}
                        />
                        <FlatList
                            data={filteredCards}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.cardItem} onPress={() => toggleCardSelection(item.id)}>
                                    <Icon name="credit-card" size={24} color={'white'} style={{paddingHorizontal:10}} />
                                    <Text style={styles.cardText}>{item.card_number}</Text>
                                    <Icon
                                        name="check-circle"
                                        size={24}
                                        color={selectedCards.includes(item.id) ? '#1b8f3a' : 'grey'}
                                    />
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={[styles.addCardButton, availableCards.length === 0 && { backgroundColor: 'grey' }]} 
                         onPress={handleAddCardsToCategory}
                         disabled={availableCards.length === 0}>
                            <Text style={styles.addButtonText}>{availableCards.length === 0 ? "No Cards to Add" : "Add Cards"}</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default CategoryaddCards;

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: '#f4f4f4' 
    },
    emptyText: { 
        color: 'lightgrey', 
        textAlign: 'center', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: '50%', 
        fontSize: 40 
    },
    cardItem: { 
        flexDirection: 'row', 
        borderTopLeftRadius:10,
        borderTopRightRadius:10,

        justifyContent:'space-between',
        alignItems: 'center', 
        paddingVertical: 15, 
        paddingHorizontal:20,
        borderWidth:1,
        marginBottom:10,
        backgroundColor:'#1c2633'
    },
    cardText: { 
        fontSize: 18,
        fontFamily:'Poppins-Regular',
        color:'white',
        paddingHorizontal:10,
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
        alignItems: 'center' 
    },
    modalOverlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
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
    closeButton: { 
        alignSelf: 'flex-end', 
        marginRight: 10, 
        marginTop: 10 
    },
    addCardTitle: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20 
    },
    searchInput: { 
        width: '100%', 
        padding: 10, 
        borderColor: 'gray', 
        borderWidth: 1, 
        borderRadius: 5, 
        marginBottom: 20 
    },
    addButtonText: { 
        color: 'white', 
        fontSize: 18,
        fontFamily:'Poppins-Regular'
    },
    addCardButton: {
        backgroundColor: '#1c2633',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,

    },
});
