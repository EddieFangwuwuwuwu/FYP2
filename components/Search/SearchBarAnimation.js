import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

function SearchBarAnimation({ onClose, onOpen, onChangeText }) {
    const animation = useSharedValue(0);
    const [value, setValue] = useState(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: animation.value === 1
                ? withTiming('80%', { duration: 500 }) // Adjust width as needed
                : withTiming('0%', { duration: 500 }),
            opacity: animation.value === 1 ? withTiming(1, { duration: 500 }) : withTiming(0, { duration: 500 }),
        };
    });

    const handlePress = () => {
        if (animation.value === 1) {
            animation.value = 0;
            setValue(0);
            onClose();
            onChangeText(''); // Reset search query
        } else {
            animation.value = 1;
            setValue(1);
            onOpen();
        }
    };

    return (
        <View style={styles.container}>
            {value === 0 && (
                <TouchableOpacity onPress={handlePress} style={styles.iconContainer}>
                    <AntIcon
                        name='search1'
                        size={24}
                        color="#1c1c1c"
                        style={styles.icon}
                    />
                </TouchableOpacity>
            )}
            <Animated.View style={[styles.searchBar, animatedStyle]}>
                {value === 1 && (
                    <TextInput
                        placeholder='Search here'
                        style={styles.searchText}
                        autoFocus
                        onChangeText={onChangeText}
                    />
                )}
                {value === 1 && (
                    <TouchableOpacity onPress={handlePress} style={styles.closeIconContainer}>
                        <AntIcon
                            name='close'
                            size={24}
                            color="#1c1c1c"
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                )}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    closeIconContainer: {
        paddingBottom: 3
    },
    searchBar: {
        height: 50,
        backgroundColor: '#c9c6c5',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        overflow: 'hidden',
        paddingHorizontal: 10,
    },
    searchText: {
        flex: 1,
        paddingLeft: 10,
    },
    icon: {
        padding: 10,
    },
    iconContainer: {
        left: 26
    }
});

export default SearchBarAnimation;
