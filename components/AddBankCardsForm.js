import React, { useState } from 'react';
import { Formik } from 'formik';
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

function AddCardsForm() {
  const [selectedCardType, setSelectedCardType] = useState('Credit Card');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ cardName: '', cardNumber: '' }}
        onSubmit={(values) => {
          console.log(values);
          console.log('Selected Card Type:', selectedCardType);
          console.log('Expiration Date:', date);
        }}
      >
        {(props) => (
          <View style={styles.form}>
            <Text style={styles.label}>Banking Card Holder Name:</Text>
            <TextInput
              placeholder="Enter Card holder Name"
              onChangeText={props.handleChange('cardName')}
              value={props.values.cardName}
              style={styles.input}
            />

            <Text style={styles.label}>Banking Card Number:</Text>
            <TextInput
              keyboardType="numeric"
              placeholder="Enter Card Number"
              onChangeText={props.handleChange('cardNumber')}
              value={props.values.cardNumber}
              style={styles.input}
            />

            <Text style={styles.label}>Banking Card Type:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCardType}
                onValueChange={(itemValue) => setSelectedCardType(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Credit Card" value="Credit Card" />
                <Picker.Item label="Debit Card" value="Debit Card" />
                <Picker.Item label="Prepaid Card" value="Prepaid Card" />
              </Picker>
            </View>

            <Text style={styles.label}>Card Expiration Date:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
              <Text>{date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            )}

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
  );
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
  datePicker: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  submitButtonContainer: {
    marginTop: 20,
    width: '100%',
  },
});

export default AddCardsForm;
