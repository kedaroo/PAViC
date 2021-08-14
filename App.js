import React, { useState, useEffect, useMemo, useReducer } from 'react';
import { View, Text, ActivityIndicator, Button, TouchableOpacity, Image, TouchableHighlight } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import socket from './service/socket';
import Tabs from './screens/AppScreen';

// screens
import Home from './screens/home_copy';
import TransactionHistoryScreen from './screens/transactionHistoryScreen';
import UserScreen from './screens/userScreen';
import TransactionForm from './screens/transactionForm';
import HomeStackScreen from './screens/homeStack';
import MakePaymentScreen from './screens/makePaymentScreen';

import RootStackScreen from './screens/RootStackScreen';

import { AuthContext } from './components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as AuthSession from 'expo-auth-session';
import jwtDecode from 'jwt-decode';

const auth0ClientId = "icHaPvJhCgZFFdIHov7myIO6EYeQjYxc";
const authorizationEndpoint = "https://dev-6deskpi9.us.auth0.com/authorize";

// const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy: false });

const Tab = createBottomTabNavigator();

export default function App() {

  const [name, setName] = useState(null);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    mobile: null
  }

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          mobile: action.mobile,
          isLoading: false
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          mobile: action.mobile,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          mobile: null,
          isLoading: false
        };
      case 'REGISTER':
        
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false
          
        };
    }
  }

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState)


  const authContext = useMemo(() => ({
    // signIn: async (userName, password) => {
    //   // setUserToken('krb')
    //   // setIsLoading(false)
    //   let userToken;
    //   // userName = null;
    //   if (userName == 'kedar' && password == '123') {
    //     try {
    //       userToken = 'krb'
    //       await AsyncStorage.setItem('userToken', userToken)
    //     } catch(e) {
    //       console.log(e)
    //     }
    //   }
    //   dispatch({type: 'LOGIN', id: userName, token: userToken});
    // },
    signIn: async (userName, userToken, mobile) => {
      socket.emit("user_registration", [userToken, mobile])
      let token;
      token = null;
      try {
        token = JSON.stringify(userToken)
        await AsyncStorage.setItem('userToken', token)
        await AsyncStorage.setItem('mobile', mobile)
      } catch(e) {
        console.log(e)
      }
      dispatch({type: 'LOGIN', id: userName, token: token, mobile: mobile});
    },
    signOut: async () => {
      // setUserToken(null)
      // setIsLoading(false)
      // auth0.webAuth.logout({ client_id: 'sg28rIo9u7bOZicq10rZ4LE7ryT6jRCq'});
    //   auth0.webAuth
    //   .clearSession({})
    //   .then(success => {
    //     Alert.alert(
    //         'Logged out!'
    //     );
    //     this.setState({ accessToken: null });
    //   })
    // .catch(error => {
    //     console.log('Log out cancelled');
    // });
      try {
        await AsyncStorage.removeItem('userToken')
      } catch(e) {
        console.log(e)
      }
      dispatch({type: 'LOGOUT' })
    },
    signUp: () => {
      setUserToken('krb')
      setIsLoading(false)
    }
  }), [])

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: auth0ClientId,
      // id_token will return a JWT token
      responseType: 'id_token',
      // retrieve the user's profile
      scopes: ['openid', 'profile', 'email'],
      extraParams: {
        // ideally, this will be a random value
        nonce: 'nonceassa',
      },
    },
    { authorizationEndpoint }
  );

  console.log(`Redirect URL: ${redirectUri}`);

  useEffect(() => {

    // if (result) {
    //   if (result.error) {
    //     Alert.alert(
    //       'Authentication error',
    //       result.params.error_description || 'something went wrong'
    //     );
    //     return;
    //   }
    //   if (result.type === 'success') {
    //     // Retrieve the JWT token and decode it
    //     const jwtToken = result.params.id_token;
    //     const decoded = jwtDecode(jwtToken);
    //     console.log('HELOOOOOOOOOO::', decoded)
    //     const { aud } = decoded;
    //     dispatch({type: 'RETRIEVE_TOKEN', token: aud})
    //     // console.log
    //     // setName(name);
    //   }
    // }

    bootStrapAsync = async () => {
      // setIsLoading(false)
      let userToken;
      userToken = null;
      let mobile;
      mobile = null;
      try {
        userToken = await AsyncStorage.getItem('userToken')
        mobile = await AsyncStorage.getItem('mobile')
      } catch(e) {
        console.log(e)
      }
      dispatch({type: 'RETRIEVE_TOKEN', token: userToken, mobile: mobile})
    }
    bootStrapAsync();
    
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
    
  }, [])

  if (loginState.isLoading) {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size='large' color='black'/>
      </View>
    )
  }

  // if (!name) {
  //   return (
  //     <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
  //       <Button
  //         disabled={!request}
  //         title="Log in with Auth0"
  //         onPress={() => promptAsync({ useProxy })}
  //       />
  //     </View>
  //   )
  // }

  const CustomButton = ({children, onPress}) => (
    <TouchableOpacity onPress={onPress} 
      activeOpacity={0.8}
      style={{
        top:-20,
        justifyContent:'center',
        alignItems:'center',
      }}
    >
      <View style={{
        // alignSelf: 'center',
        width:50,
        height:50,
        borderRadius:35,
        backgroundColor: '#4161f4',
        elevation: 6
      }}>
        {children}
      </View>
    </TouchableOpacity>
  )

  return (
    <AuthContext.Provider value={authContext}>
        <NavigationContainer>
         { loginState.userToken != null ? (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  if (route.name === 'Home') {
                    iconName = 'home'
                  } else if (route.name === 'Recent Transactions') {
                    iconName = 'ios-receipt'
                  } else if (route.name === 'My Profile') {
                    iconName = 'person' 
                  }
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#4363f4',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarShowLabel: false,
                // tabBarHideOnKeyboard: true,
                tabBarStyle: {
                  //  bottom: 20, left: 20, right: 20, backgroundColor: '#fff',
                  // borderRadius: 15,
                   height: 60, elevation: 0, position: 'absolute'
                }
              })}
            >
            <Tab.Screen name="Home" component={HomeStackScreen} initialParams={{token: loginState.userToken, mobile: loginState.mobile}} />
            <Tab.Screen options={{
              tabBarIcon: ({focused}) => (
                <Image source={require('./assets/plus.png')} resizeMode="contain" style={{
                  width:32,
                  height: 32, 
                  tintColor: 'white',
                }}/>
              ),
              tabBarButton: (props) => (
                <CustomButton {...props}/>
              )
            }} name="Transaction Form" component={MakePaymentScreen} initialParams={{token: loginState.userToken, mobile: loginState.mobile}} />
            <Tab.Screen name="Recent Transactions" component={TransactionHistoryScreen} initialParams={{token: loginState.userToken, mobile: loginState.mobile}} />
            {/* <Tab.Screen name="My Profile" component={UserScreen} initialParams={{token: loginState.userToken, mobile: loginState.mobile}} /> */}
          </Tab.Navigator> 
          )
          :
          <RootStackScreen />
        } 
      </NavigationContainer>
    </AuthContext.Provider>
  )
}