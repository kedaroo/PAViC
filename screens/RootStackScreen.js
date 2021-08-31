import React, {useState, useEffect} from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import OnboardingScreen from './OnboardingScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

const RootStack = createStackNavigator();

const RootStackScreen = ({ navigation }) => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(null)

    useEffect(() => {
        AsyncStorage.getItem('alreadyLaunched').then(value => {
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
            </RootStack.Navigator>
        )
    } else {
        return <SplashScreen />
    }
}

export default RootStackScreen;