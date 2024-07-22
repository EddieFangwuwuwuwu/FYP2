import React, { useState } from 'react';
import { Formik } from 'formik';
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

function CreateCategoryForm(){
    const [selectedCategoryType,setCategoryType] = useState('Credit Card');
return(
    <View style={styles.container}>
    <Formik
      initialValues={{ categoryName: ''}}
      onSubmit={(values) => {
        console.log(values);
        console.log('Selected Category Type:', selectedCategoryType);
      }}
    >
      {(props) => (
        <View style={styles.form}>
          <Text style={styles.label}>Cateogry Name:</Text>
          <TextInput
            placeholder="Enter CategoryName"
            onChangeText={props.handleChange('categoryName')}
            value={props.values.cardName}
            style={styles.input}
          />

          <Text style={styles.label}>Category type:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategoryType}
              onValueChange={(itemValue) => setCategoryType(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Credit Card" value="Credit Card" />
              <Picker.Item label="Debit Card" value="Debit Card" />
              <Picker.Item label="Prepaid Card" value="Prepaid Card" />
            </Picker>
          </View>
          <View style={styles.submitButtonContainer}>
            <Button
              title="Submit"
              color="#1c2633"
              onPress={props.handleSubmit}
            />
          </View>
        </View>
      )}
    </Formik>
  </View>
)
}

const styles = StyleSheet.create({
    container: {
      width: '100%',
    },
    form: {
      width: '100%',
      padding: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      marginBottom: 20,
      overflow: 'hidden',
    },
    picker: {
      marginTop:0,
      
      width: '100%',
    },
    pickerItem: {
      textAlign: 'center', // Centers the text
    },
    submitButtonContainer: {
      marginTop: 20,
      width: '100%',
    },
  });
  
export default CreateCategoryForm;