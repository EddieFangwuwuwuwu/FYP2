import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CreateCategoryForm from './CreateCategoryForm';
import { fetchCategories } from './api/api';  // Import your fetchCategories function

function CategoryScreen({ searchQuery = '' }) {  // Provide a default value for searchQuery
    const [modalOpen, setModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    // Fetch categories from the API
    const loadCategories = async () => {
        try {
            const fetchedCategories = await fetchCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        loadCategories(); // Load categories when the component is mounted
    }, []);

    const addCategory = (newCategory) => {
        setCategories([...categories, newCategory]);
        setModalOpen(false);
    };

    const filteredCategories = categories.filter(category => {
        if (!category.cateName) {
            console.warn('Category missing cateName:', category);
            return false; // Exclude this category from the filtered list
        }
        return category.cateName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <View style={styles.container}>
            {categories.length === 0 ? (
                <Text style={styles.emptyText}>No Category created yet</Text>
            ) : (
                <FlatList
                    data={filteredCategories}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.items}>
                            <View style={styles.itemContent}>
                                <Icon name="folder" size={45} color="white" style={styles.icon} />
                                <View style={styles.textcontainer}>
                                    <Text style={styles.name}>{item.cateName}</Text> 
                                    <Text style={styles.subname}>{item.cateType}</Text>  
                                </View>
                                <Icon name="chevron-right" size={45} color="white" style={styles.iconRight} />
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
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
                        <Icon name="folder-o" size={100} color="#1c2633" />
                        <Text style={styles.addCardTitle}>Create New Category</Text>
                        <CreateCategoryForm addCategory={addCategory} />
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
    emptyText: {
        color: 'lightgrey',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '50%',
        fontSize: 40
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
    }
});

export default CategoryScreen;
