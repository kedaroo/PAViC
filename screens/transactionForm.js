import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import { globalStyles } from '../styles/global';
import { Formik } from 'formik';
import * as yup from 'yup';

const reviewSchema = yup.object().shape({
    from: yup.string()
      .required()
      .min(4),
    to: yup.string()
      .required()
      .min(10)
      .max(10),
    amount: yup.string()
      .required(),
  });

export default function TransactionForm({ addTransaction, mobile }) {
    styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal:10,
            paddingVertical: 10,
            // backgroundColor: 'green'
        },
        textInput: {
            // backgroundColor: 'pink',
            marginTop: 40,
            marginBottom: 100,
            padding: 10,
            flex:1,
            justifyContent: 'space-between'
        },
        form: {
            marginTop: 30,
            paddingVertical: 10,
            justifyContent: 'space-evenly',
            // backgroundColor: 'yellow',
            flex: 1
        },
        recipient: {
            // textAlign: 'center',
            fontSize: 20,
            backgroundColor: 'white',
            padding: 14,
            elevation: 25,
            borderRadius: 8
        },
        amount: {
            // textAlign: 'center',
            fontSize: 20,
            backgroundColor: 'white',
            padding: 14,
            elevation: 25,
            borderRadius: 8
            // borderBottomWidth: 1,
            // borderColor: 'blue'
        },
        buttons: {
            // alignSelf: 'flex-end',
            backgroundColor: '#4f6cf6',
            paddingVertical: 16,
            // paddingHorizontal: 45,
            marginTop: 22,
            marginHorizontal: 32,
            borderRadius: 14,
            justifyContent: 'center',
            // elevation: 5
        },
        buttonText: {
            color: 'white',
            fontSize: 17,
            alignItems: 'center',
            textAlign: 'center'
        }
    })

    // console.log('IM INSIDE TRANSACTION FORM', addTransaction)
    return (
        <View style = {styles.container}>
            
            <Formik
                initialValues = {{ from: mobile, to: 0, amount: 0 }}
                validationSchema = {reviewSchema}
                onSubmit = {(values, actions) => {
                    console.log('IM INSIDE SUBMIT HANDLER')
                    actions.resetForm()
                    addTransaction(values);
                }}
            >
                {(props) => (

                    <View style={styles.textInput}  >
                        <View>
                            <Text style={{color: '#374151', fontSize: 32, fontWeight: '700'}}>Make</Text>
                            <Text style={{color: '#374151', fontSize: 48, fontWeight: '700'}}>Payment</Text>
                        </View>
                        
                        
                        {/* <TextInput 
                            style = {globalStyles.input}
                            placeholder = 'From address'
                            onChangeText = {props.handleChange('from')}
                            // value = {props.values.from}
                            value = 'Siddhi'
                            onBlur = {props.handleBlur('from')}
                        />
                        <Text style = {globalStyles.errorText}>{ props.touched.from && props.errors.from}</Text> */}

                        <View style={styles.form}>
                            <View>
                            <TextInput 
                                style = {styles.recipient}
                                placeholder = 'Recipient'
                                onChangeText = {props.handleChange('to')}
                                value = {props.values.to}
                                onBlur = {props.handleBlur('to')}
                                keyboardType = 'number-pad'
                        
                            />
                            <Text style = {globalStyles.errorText}>{props.touched.to && props.errors.to}</Text>

                            <TextInput 
                                style = {styles.amount}
                                placeholder = 'Amount'
                                onChangeText = {props.handleChange('amount')}
                                value = {props.values.amount}
                                keyboardType = 'number-pad'
                                onBlur = {props.handleBlur('amount')}
                            />
                            <Text style = {globalStyles.errorText}>{props.touched.amount && props.errors.amount}</Text>

                            <TouchableHighlight style={styles.buttons} underlayColor='#1E40AF' onPress = {props.handleSubmit}>
                                <Text style={styles.buttonText}>Send Money</Text>
                            </TouchableHighlight>
                            </View>

                            

                        </View>
                    </View>
                )}
            </Formik>
        </View>
    )
}

