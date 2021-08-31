import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import { globalStyles } from '../styles/global';
import { Formik } from 'formik';
import * as yup from 'yup';
import Autocomplete from 'react-native-autocomplete-input';
import TodoItem from './card';
import db from '../database/database';

const reviewSchema = yup.object().shape({
    from: yup.string()
      .required(),
    //   .min(4),
    to: yup.string()
      .required(),
    //   .min(10)
    //   .max(10),
    amount: yup.string()
      .required(),
  });

  const Item = ({ title }) => (
    <View>
      <Text>{title}</Text>
    </View>
  );

export default function TransactionForm({ addTransaction, userName}) {

    styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal:10,
            paddingVertical: 10,
            backgroundColor: '#fff'
        },
        textInput: {
            // backgroundColor: 'pink',
            marginTop: 25,
            marginBottom: 100,
            padding: 10,
            flex:1,
            justifyContent: 'space-between'
        },
        form: {
            // marginTop: 30,
            paddingVertical: 10,
            justifyContent: 'space-evenly',
            // backgroundColor: 'yellow',
            flex: 1
        },
        action: {
            // textAlign: 'center',
            fontSize: 18,
            backgroundColor: 'white',
            paddingBottom: 10,
            // elevation: 25,
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            marginHorizontal: 10,
            marginTop: 16
            // borderRadius: 8
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
        },
        prompt: {
            fontSize: 16,
            marginBottom: 8,
            marginLeft: 2
        }
    })

    const loadUsers = () => {
        db.transaction((tx) => {
            console.log('TRYING TO LOAD USERS FOR HistoryScreen...')
            tx.executeSql(
                'SELECT name, mobile FROM users',
                [], 
                (_tx, {rows: {_array} }) => {
                    console.log('LOADED USERS:')
                    // var dict = []
                    // for (var i = 0; i < _array.length; i++) {
                    //     dict.push({'mobile': })
                    //     dict[_array[i].mobile] = _array[i].name 
                    // }
                    setUsers(_array)
                    console.log(_array)
                }, 
                () => console.log('Fetching USERS FOR HISTORY FAILED!')
            )
        }, () => console.log('Fetching USERS FOR HISTORY error'), () => console.log('Fetching USERS FOR HISTORY SUCCESSFULL'));
    }

    // For Main Data
    const [users, setUsers] = useState([])
  const [films, setFilms] = useState([]);
  // For Filtered Data
  const [filteredFilms, setFilteredFilms] = useState([]);
  // For Selected Data
  const [selectedValue, setSelectedValue] = useState({});

//   useEffect(() => {
//       loadUsers()
//     fetch('https://aboutreact.herokuapp.com/getpost.php?offset=1')
//       .then((res) => res.json())
//       .then((json) => {
//         const {results: films} = json;
//         console.log(films)
//         setFilms(films);
//         //setting the data in the films state
//       })
//       .catch((e) => {
//         alert(e);
//       });
//   }, []);

  const findFilm = (query) => {
    // Method called every time when we change the value of the input
    if (query) {
      // Making a case insensitive regular expression
      const regex = new RegExp(`${query.trim()}`, 'i');

      // Setting the filtered film array according the query
      var filteredItems = users.filter((user) => user.name.search(regex) >= 0)
      var filteredItems2 = [];
      for (var i = 0; i < filteredItems.length; i++) {
        filteredItems2.push(filteredItems[i].name)
      }
      console.log(filteredItems)
    //   console.log(Object.keys(filteredItems))
    //   setFilteredFilms(
    //     users.filter((user) => user.mobile.toString().search(regex) >= 0)
    // );

    } else {
      // If the query is null then return blank
      setFilteredFilms([]);
    }
  };

  console.log(filteredFilms)
  const renderItem = ({item}) => (
      <Item name={item.name} />
  )

    

    // console.log('IM INSIDE TRANSACTION FORM', addTransaction)
    return (
        <View style = {styles.container}>
            
            <Formik
                initialValues = {{ from: userName, to: '', amount: '' }}
                validationSchema = {reviewSchema}
                onSubmit = {(values, actions) => {
                    console.log('IM INSIDE SUBMIT HANDLER')
                    // console.log('This is the username::', userName)
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
                                style = {styles.action}
                                placeholder = 'Enter the username of recipient'
                                onChangeText = {props.handleChange('to')}
                                value = {props.values.to}
                                onBlur = {props.handleBlur('to')}
                                // keyboardType = 'number-pad' mobile
                        
                            />
                            <Text style = {globalStyles.errorText}>{props.touched.to && props.errors.to}</Text>

                            
                            <TextInput 
                                style = {styles.action}
                                placeholder = 'Enter the amount'
                                onChangeText = {props.handleChange('amount')}
                                value = {props.values.amount}
                                keyboardType = 'number-pad'
                                onBlur = {props.handleBlur('amount')}
                            />
                            <Text style = {globalStyles.errorText}>{props.touched.amount && props.errors.amount}</Text>
                            </View>
                            <View> 

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

