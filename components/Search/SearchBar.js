import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

function Search() {
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      <Icon name="search1" size={20} color="grey" />
      <TextInput
        style={styles.input}
        placeholder="Search User"
        value={search}
        onChangeText={setSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
    marginLeft:0,
    width: '90%',
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
});

export default Search;
