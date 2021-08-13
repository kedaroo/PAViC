import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { globalStyles } from '../styles/global';
import { Formik } from 'formik';
import * as yup from 'yup';
import FlatButton from '../shared/button';

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

export default function TransactionForm({ addTransaction, mobile}) {
    return (
        <View style = {globalStyles.container}>
            <Formik
                initialValues = {{ from: mobile, to: 0, amount: 0 }}
                validationSchema = {reviewSchema}
                onSubmit = {(values, actions) => {
                    actions.resetForm()
                    addTransaction(values);
                }}
            >
                {(props) => (
                    <View>
                        {/* <TextInput 
                            style = {globalStyles.input}
                            placeholder = 'From address'
                            onChangeText = {props.handleChange('from')}
                            // value = {props.values.from}
                            value = 'Siddhi'
                            onBlur = {props.handleBlur('from')}
                        />
                        <Text style = {globalStyles.errorText}>{ props.touched.from && props.errors.from}</Text> */}

                        <TextInput 
                            style = {globalStyles.input}
                            placeholder = 'To number'
                            onChangeText = {props.handleChange('to')}
                            value = {props.values.to}
                            onBlur = {props.handleBlur('to')}
                            keyboardType = 'number-pad'
                        />
                        <Text style = {globalStyles.errorText}>{props.touched.to && props.errors.to}</Text>

                        <TextInput 
                            style = {globalStyles.input}
                            placeholder = 'Amount'
                            onChangeText = {props.handleChange('amount')}
                            value = {props.values.amount}
                            keyboardType = 'number-pad'
                            onBlur = {props.handleBlur('amount')}
                        />
                        <Text style = {globalStyles.errorText}>{props.touched.amount && props.errors.amount}</Text>

                        <FlatButton text = 'submit' onPress = {props.handleSubmit}/>

                    </View>
                )}
            </Formik>
        </View>
    )
}