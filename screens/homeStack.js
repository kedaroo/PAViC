import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Home from './home_copy';

const HomeStack = createStackNavigator();

const HomeStackScreen = ({ navigation, route }) => {
    return (
        <HomeStack.Navigator screenOptions={{headerShown:false}}>
            <HomeStack.Screen name='Home Screen' component={Home} initialParams={{token: route.params.token, mobile: route.params.mobile}} />
        </HomeStack.Navigator>
    )
}
    
export default HomeStackScreen;