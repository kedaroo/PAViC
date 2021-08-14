import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './home_copy';
import TransactionForm from './transactionForm2';
import TransactionHistoryScreen from './transactionHistoryScreen';

const Tab = createBottomTabNavigator()

const Tabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home}/>
            <Tab.Screen name="TransactionForm" component={TransactionForm} />
            <Tab.Screen name="TransactionHistoryScreen" component={TransactionHistoryScreen} />
        </Tab.Navigator>
    )
}

export default Tabs;