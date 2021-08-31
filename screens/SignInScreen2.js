import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput, Alert } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { AuthContext } from '../components/context';

import * as AuthSession from 'expo-auth-session';
import jwtDecode from 'jwt-decode';
import socket from '../service/socket';

const auth0ClientId = "icHaPvJhCgZFFdIHov7myIO6EYeQjYxc";
const authorizationEndpoint = "https://dev-6deskpi9.us.auth0.com/authorize";

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

export default function SignInScreen({ navigation }) {

    const [data, setData] = useState({
        username: '',
        password: '',
        mobile: '',
        disability: true,
        check_textInputChange: false,
        secureTextEntry: true
    })

    const { signUp } = useContext(AuthContext);

    const [request, result, promptAsync] = AuthSession.useAuthRequest(
        {
          redirectUri,
          clientId: auth0ClientId,
          responseType: 'id_token',
          scopes: ['openid', 'profile'],
          extraParams: {
            nonce: 'nonceassa',
          },
        },
        { authorizationEndpoint }
    );

    useEffect(() => {

        if (result) {
            if (result.error) {
                Alert.alert(
                    'Authentication error',
                    result.params.error_description || 'something went wrong'
                );
                return;
            }
            if (result.type === 'success') {
                const jwtToken = result.params.id_token;
                const decoded = jwtDecode(jwtToken);
                const { given_name } = decoded;
                loginHandle(given_name, decoded)
            }
        }
    }, [result])

    const textInputChange = (val) => {
        if (val.length > 4) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                disability: false
            })
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false
            })
        }
    }

    const loginHandle = () => {
        signUp(data.username);
    }

    const userNameHandler = () => {
        if (data.username.length < 5) {
            Alert.alert('', 'Minimum 5 characters required')
            return
        }
        socket.emit("check user name", data.username)
        socket.once("set username", args => {
            console.log(args)
            if (args) {
                loginHandle()
            } else {
                Alert.alert('Username already exists!', 'Please try again with another username')
            }
        })
    }

    return (
        <View style={styles.container}>
            <StatusBar style='auto'/>
            <View style={styles.header}>
                <Text style={styles.text_header} >Welcome New User!</Text>
            </View>

            <Animatable.View 
                animation='fadeInUpBig'
                style={styles.footer}
            >
                <Text style={styles.text_footer} >What should people call you?</Text>
                <View style={styles.action}>
                    <TextInput 
                        placeholder='Set Username'
                        style={styles.textInput}
                        autoCapitalize='none'
                        onChangeText={(val) => textInputChange(val)}
                        maxLength={12}
                    />
                    {data.check_textInputChange ?  

                    <Animatable.View
                        animation='bounceIn'
                    >
                        <Feather 
                            name='check-circle'
                            color = 'green'
                            size={24}
                        />
                    </Animatable.View>
                    
                    : 
                    <Animatable.View
                        animation='bounceIn'
                    >
                        <Feather 
                            name='alert-circle'
                            color = 'red'
                            size={24}
                        />
                    </Animatable.View>

                    }
                </View>

                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => userNameHandler()}
                        disabled={data.disability}
                    >
                        <Text style={[styles.textSign, {color: 'white'}]}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#607af8'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 30
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
        fontSize: 32
    },
    text_footer: {
        color: '#05375a',
        fontSize: 20,
        textAlign: 'justify'
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        borderWidth: 2,
        borderColor: '#f2f2f2',
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
    },
    signIn: {
        width: '80%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: '#607af8'
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
  });