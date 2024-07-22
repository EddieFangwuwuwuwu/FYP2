import {React,useState} from 'react';
import {View,Text,StyleSheet,TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

function Search(){
    const [search,setSearch] = useState(false);
    return(
    <View style={styles.container}>
        <Icon name="search1" size={20} color='grey'/>
        <TextInput placeholder='Search User' 
        value={search}
        onChangeText={setSearch}/>
    </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:'80%',
        backgroundColor:'white',
        flexDirection:'row'
    },

    field:{

    }
})

export default Search;