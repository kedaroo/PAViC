import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './home_copy';
import Rece

const Tab = createBottomTabNavigator()

const Tabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home}/>
        </Tab.Navigator>
    )
}