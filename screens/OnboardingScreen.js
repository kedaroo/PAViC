import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

export default function ({ navigation }) {
    return (
        
        <Onboarding 
            onSkip={() => navigation.replace('SplashScreen')}
            onDone={() => navigation.replace('SplashScreen')}
            pages={[
                {
                    backgroundColor: '#FCE7F3',
                    title: 'Make hassle free paymemts',
                    subtitle: '',
                    image: <Image source={require('../assets/hassle_free.png')} style={styles.image} />,
                    
                },
                {
                    backgroundColor: '#D1FAE5',
                    image: <Image source={require('../assets/reward.png')} style={styles.image} />,
                    title: 'Mine transactions and earn rewards!',
                    subtitle: '',
                },
                {
                    backgroundColor: '#FEF3C7',
                    image: <Image source={require('../assets/bonus.png')} style={styles.image} />,
                    title: 'Sign-up bonus ahead!',
                    subtitle: 'Fetch and mine your first transaction to avail sign-up bonus',
                }
            ]}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        // flex:1,
        width: '100%',
        height: '100%',
        // backgroundColor: 'blue',
        resizeMode: 'center',
        // paddingVertical: -100
        // marginVertical: -150
    }
})
