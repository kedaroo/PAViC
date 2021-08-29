import React, {useState, useEffect} from 'react';

import { createStackNavigator } from '@react-navigation/stack';

// import SignInScreen from './userNameScreen';
import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen2';
import SignUpScreen from './SignUpScreen';
import OnboardingScreen from './OnboardingScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';


const RootStack = createStackNavigator();

const RootStackScreen = ({ navigation }) => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(null)

    useEffect(() => {
        AsyncStorage.getItem('alreadyLaunchedd').then(value => {
            if(value == null) {
                AsyncStorage.setItem('alreadyLaunched', 'true')
                setIsFirstLaunch(true)
            } else {
                setIsFirstLaunch(false)
            }
        })
    }, [])

    if (isFirstLaunch == null) {
        return null
    } else if (isFirstLaunch == true) {
        return (
            <RootStack.Navigator screenOptions={{headerShown:false}}>
                <RootStack.Screen name='Onboarding' component={OnboardingScreen} />
                <RootStack.Screen name='SplashScreen' component={SplashScreen} />
                <RootStack.Screen name='SignInScreen' component={SignInScreen} />
                <RootStack.Screen name='SignUpScreen' component={SignUpScreen} />
            </RootStack.Navigator>
        )
    } else {
        return <SplashScreen />
    }

    // return(
    //     <RootStack.Navigator screenOptions={{headerShown:false}}>
    //         <RootStack.Screen name='Onboarding' component={OnboardingScreen} />
    //         <RootStack.Screen name='SplashScreen' component={SplashScreen} />
    //         <RootStack.Screen name='SignInScreen' component={SignInScreen} />
    //         <RootStack.Screen name='SignUpScreen' component={SignUpScreen} />
    //     </RootStack.Navigator>
    // )
}

export default RootStackScreen;