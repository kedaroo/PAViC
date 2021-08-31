import React, { useState, useContext, useEffect } from 'react';
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
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AuthContext } from '../components/context';

import * as AuthSession from 'expo-auth-session';
import jwtDecode from 'jwt-decode';

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

    const { signIn } = useContext(AuthContext);

    const [request, result, promptAsync] = AuthSession.useAuthRequest(
        {
          redirectUri,
          clientId: auth0ClientId,
          // id_token will return a JWT token
          responseType: 'id_token',
          // retrieve the user's profile
          scopes: ['openid', 'profile'],
          extraParams: {
            // ideally, this will be a random value
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
            // Retrieve the JWT token and decode it
            const jwtToken = result.params.id_token;
            const decoded = jwtDecode(jwtToken);
            console.log('HELOOOOOOOOOO::', decoded)
            const { aud } = decoded;
            const { given_name } = decoded;
            loginHandle(given_name, decoded)
            // dispatch({type: 'RETRIEVE_TOKEN', token: aud})
            // console.log
            // setName(name);
          }
        }
    
        // setTimeout(async () => {
        //   // setIsLoading(false)
        //   let userToken;
        //   userToken = null;
        //   try {
        //     userToken = await AsyncStorage.getItem('userToken', userToken)
        //   } catch(e) {
        //     console.log(e)
        //   }
        //   dispatch({type: 'RETRIEVE_TOKEN', token: userToken})
        // }, 1000)
        
      }, [result])

    const textInputChange = (val) => {
        if (val.length == 10) {
            setData({
                ...data,
                mobile: val,
                check_textInputChange: true,
                disability: false
            })
        } else {
            setData({
                ...data,
                username: val,
                disability: true,
                check_textInputChange: false
            })
        }
    }

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        })
    }

    const updateSecureTestEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        })
    }

    const loginHandle = (username, password) => {
        signIn(username, password, data.mobile);
    }

    return (
        <View style={styles.container}>
            <StatusBar style='auto'/>
            <View style={styles.header}>
                <Text style={styles.text_header} >Welcome!</Text>
            </View>

            <Animatable.View 
                animation='fadeInUpBig'
                style={styles.footer}
            >
                <Text style={styles.text_footer} >Phone</Text>
                <View style={styles.action}>
                    <FontAwesome 
                        name="phone"
                        color={'black'}
                        size={28}
                    />
                    <TextInput 
                        placeholder='Enter you mobile number'
                        style={styles.textInput}
                        autoCapitalize='none'
                        onChangeText={(val) => textInputChange(val)}
                        keyboardType='phone-pad'
                        maxLength={10}
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
{/* 
                <Text style={[styles.text_footer,
                        {marginTop: 35}]} >Password</Text>

                <View style={styles.action}>
                    <Feather 
                        name="lock"
                        color={'black'}
                        size={20}
                    />
                    <TextInput 
                        placeholder='Your Password'
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={styles.textInput}
                        autoCapitalize='none'
                        onChangeText={(val) => handlePasswordChange(val)}
                    />
                    <TouchableOpacity
                        onPress={updateSecureTestEntry}
                    >
                        {data.secureTextEntry ? 
                            <Feather 
                                name='eye-off'
                                color = 'grey'
                                size={20}
                            />
                            :
                            <Feather 
                                name='eye'
                                color = 'grey'
                                size={20}
                            />
                        }
                    </TouchableOpacity>
                </View> */}

                <View style={styles.Button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => promptAsync({ useProxy })}
                        disabled={data.disability}
                    >
                        <LinearGradient
                            colors={data.disability ? ['#DBEAFE', '#BFDBFE', '#93C5FD'] : ['#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6']}
                            colors={data.disability ? ['#DBEAFE', '#BFDBFE', '#93C5FD'] : ['#889dfd', '#647ef9', '#3e5ef3']}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, {
                                color: 'white'
                            }]}>Continue</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    

                    {/* <TouchableOpacity
                        onPress={() => navigation.navigate('SignUpScreen')}
                        style={[styles.signIn, {
                            borderColor: 'violet',
                            borderWidth: 1,
                        }]}
                    >
                        <Text style={[styles.textSign, {
                            color: 'violet'
                        }]} >Sign Up</Text>
                    </TouchableOpacity> */}
                </View>

            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#4968f5'
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