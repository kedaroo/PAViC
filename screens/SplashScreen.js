import React, { useState, useEffect, useContext} from 'react';
import {
    View, 
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as AuthSession from 'expo-auth-session';
import jwtDecode from 'jwt-decode';

import { AuthContext } from '../components/context';

const auth0ClientId = "icHaPvJhCgZFFdIHov7myIO6EYeQjYxc";
const authorizationEndpoint = "https://dev-6deskpi9.us.auth0.com/authorize";

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

export default function SplashScreen({ navigation }) {

    const [data, setData] = useState({
        username: '',
        password: '',
        token: '',
        monile: ''
        // check_textInputChange: false,
        // secureTextEntry: true
    })

    const { signIn } = useContext(AuthContext);

    // const textInputChange = (val) => {
    //     if (val.length != 0) {
    //         setData({
    //             ...data,
    //             username: val,
    //             check_textInputChange: true
    //         })
    //     } else {
    //         setData({
    //             ...data,
    //             username: val,
    //             check_textInputChange: false
    //         })
    //     }
    // }

    // const handlePasswordChange = (val) => {
    //     setData({
    //         ...data,
    //         password: val
    //     })
    // }

    // const updateSecureTestEntry = () => {
    //     setData({
    //         ...data,
    //         secureTextEntry: !data.secureTextEntry
    //     })
    // }

    // const loginHandle = (username, password) => {
    //     signIn(username, password);
    // }

    const loginHandle = (token) => {
        // console.log('Inisde login handle', token)
        signIn(token);
    }

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
            console.log('HELOOOOOOOOOO::THIS IS THE RESULT', decoded)
            // const { picture } = decoded;
            // const { name } = decoded;
            loginHandle(decoded)
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

    return (
        <View style={styles.container}>
            <StatusBar style='auto'/>
            <View style={styles.header}>
                <Animatable.Image 
                    animation='bounceIn'
                    duraton='1500'
                    source={require('../assets/icon.png')} 
                    style={styles.logo}
                    resizeMode='stretch'
                />
            </View>
            <Animatable.View 
                style={styles.footer} 
                animation='fadeInUpBig'
            >
                <Text style={styles.title}>VIT Remit</Text>
                <Text style={styles.text}>Sign in with account</Text>
                <View style={styles.button}>
                    {/* <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}> */}
                    <TouchableOpacity onPress={() => promptAsync({ useProxy })}>
                    {/* <TouchableOpacity onPress={}> */}
                        <LinearGradient
                            colors={['#93C5FD', '#2563EB']}
                            style={styles.signIn}
                        >
                            <Text style={styles.textSign}>Get Started</Text>
                            <MaterialIcons 
                                name='navigate-next'
                                color='white'
                                size={20}
                            />
                        </LinearGradient>

                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

const {height} = Dimensions.get("screen");
const height_logo = height * 0.5;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#FFF'
  },
  header: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center'
  },
  footer: {
      flex: 1,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30
  },
  logo: {
      width: height_logo,
      height: height_logo
  },
  title: {
      color: '#05375a',
      fontSize: 30,
      fontWeight: 'bold'
  },
  text: {
      color: 'grey',
      marginTop:5
  },
  button: {
      alignItems: 'flex-end',
      marginTop: 30
  },
  signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      flexDirection: 'row'
  },
  textSign: {
      color: 'white',
      fontWeight: 'bold'
  }
});