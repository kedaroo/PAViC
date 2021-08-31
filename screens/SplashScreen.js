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
import { StatusBar } from 'expo-status-bar';
import * as AuthSession from 'expo-auth-session';
import jwtDecode from 'jwt-decode';

import { AuthContext } from '../components/context';

const auth0ClientId = "icHaPvJhCgZFFdIHov7myIO6EYeQjYxc";
const authorizationEndpoint = "https://dev-6deskpi9.us.auth0.com/authorize";

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

export default function SplashScreen({ navigation }) {

    const { signIn } = useContext(AuthContext);

    const loginHandle = (token) => {
        signIn(token);
    }

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
            loginHandle(decoded)
          }
        }
        
    }, [result])

    return (
        <View style={styles.container}>
            <StatusBar style='auto'/>
            <View style={styles.header}>
                <Animatable.Image 
                    animation='fadeIn'
                    duraton='1500'
                    source={require('../assets/money_transfer.png')} 
                    style={styles.logo}
                    resizeMode='contain'
                />
            </View>
            <Animatable.View 
                style={styles.footer} 
                animation='fadeInUpBig'
            >
                <Text style={styles.title}>PAViC</Text>
                <Text style={styles.text}>Payment App for Vitcoin Cryptocurrency</Text>
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => promptAsync({ useProxy })}>
                        <LinearGradient
                            colors={['#fff', '#fff']}
                            style={styles.signIn}
                        >
                            <Text style={styles.textSign}>Sign in</Text>
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
      flex: 1.2,
      backgroundColor: '#607af8',
      borderTopLeftRadius: 34,
      borderTopRightRadius: 34,
      paddingVertical: 40,
      paddingHorizontal: 30,
      alignItems: 'center'
  },
  logo: {
      width: height_logo,
      height: height_logo,
    resizeMode: 'contain'
  },
  title: {
      color: '#fff',
      fontSize: 44,
      fontWeight: 'bold'
  },
  text: {
      color: '#fff',
      marginTop: 5,
      fontSize: 20,
      textAlign: 'center'
  },
  button: {
      alignItems: 'center',
      marginTop: 30,
  },
  signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      flexDirection: 'row',
      paddingVertical: 24,
  },
  textSign: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 18
  }
});