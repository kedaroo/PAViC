import React, {useState, useEffect} from 'react';
import { globalStyles } from '../styles/global';
import {
    View, 
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Platform,
    TextInput
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Autocomplete from 'react-native-autocomplete-input';

export default function TransactionForm({ addTransaction, mobile, users}) {

    const [films, setFilms] = useState([]);

    // For Filtered Data
  const [filteredFilms, setFilteredFilms] = useState([]);
  // For Selected Data
  const [selectedValue, setSelectedValue] = useState({});

  useEffect(() => {
    fetch('https://aboutreact.herokuapp.com/getpost.php?offset=1')
      .then((res) => res.json())
      .then((json) => {
        const {results: films} = json;
        setFilms(films);
        console.log(films)
        //setting the data in the films state
      })
      .catch((e) => {
        alert(e);
      });
  }, []);


    const findFilm = (query) => {
        // Method called every time when we change the value of the input
        if (query) {
          // Making a case insensitive regular expression
          const regex = new RegExp(`${query.trim()}`, 'i');
          // Setting the filtered film array according the query
          setFilteredFilms(
              films.filter((film) => film.title.search(regex) >= 0)
          );
        } else {
          // If the query is null then return blank
          setFilteredFilms([]);
        }
      };

    
    return (
        <View style = {globalStyles.container}>
            <StatusBar style='auto'/>
            <View style={styles.header}>
                <Text style={styles.text_header} >Make Payment!</Text>
            </View>

            <Animatable.View 
                animation='fadeInUpBig'
                style={styles.footer}
            >
                <Text style={styles.text_footer} >To</Text>
                <View style={styles.action}>
                    <FontAwesome 
                        name="phone"
                        color={'black'}
                        size={28}
                    />
                    {/* <TextInput 
                        placeholder="Enter recipient's name"
                        style={styles.textInput}
                        autoCapitalize='none'
                        onChangeText={(val) => textInputChange(val)}
                        keyboardType='phone-pad'
                        maxLength={10}
                    /> */}

<Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.autocompleteContainer}
          // Data to show in suggestion
          data={filteredFilms}
          // Default value if you want to set something in input
          defaultValue={
            JSON.stringify(selectedValue) === '{}' ?
            '' :
            selectedValue.title
          }
          // Onchange of the text changing the state of the query
          // Which will trigger the findFilm method
          // To show the suggestions
          onChangeText={(text) => findFilm(text)}
          placeholder="Enter the film title"
          renderItem={({item}) => (
            // For the suggestion view
            <TouchableOpacity
              onPress={() => {
                setSelectedValue(item);
                setFilteredFilms([]);
              }}>
              <Text style={styles.itemText}>
                  {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
                    


                </View>

                <View style={styles.Button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => promptAsync({ useProxy })}
                        // disabled={data.disability}
                    >
                        <LinearGradient
                        colors={['pink', 'violet']}
                            // colors={data.disability ? ['#DBEAFE', '#BFDBFE', '#93C5FD'] : ['#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6']}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, {
                                color: 'white'
                            }]}>Continue</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                
                </View>

            </Animatable.View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#60A5FA'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        // paddingHorizontal: 20,
        paddingBottom: 30
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
      },
    footer: {
        flex: 2,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 38
    },
    text_footer: {
        color: '#05375a',
        fontSize: 24
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        // borderBottomWidth: 1,
        borderWidth: 2,
        // borderBottomColor: '#f2f2f2',
        borderColor: '#f2f2f2',
        // paddingBottom: 5
        borderRadius: 10,
        padding: 14
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        // marginTop: Platform.OS === 'ios' ? 0 : -6,
        paddingLeft: 12,
        color: '#05375a',
        fontSize: 18
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50,
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
  });