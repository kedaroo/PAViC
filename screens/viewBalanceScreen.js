import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { globalStyles } from '../styles/global';
import FlatButton from '../shared/button';
import getBalance from '../database/getBalance';

export default function ViewBalanceScreen () {

    const [text, onChangeText] = useState('') 
    const [balance, setBalance] = useState(0)

    const foo = async () => {
        var x = await getBalance(text)
        console.log('THIS IS INSIDE foo')
        console.log(x)
        console.log(typeof x)
        setBalance(x)
        console.log(balance)
    }

    return (
        <View style = {globalStyles.container} >
            <TextInput style = {styles.input} placeholder = {'Enter name here to check balance'} onChangeText={onChangeText} />
            <FlatButton text = 'Check Balance' onPress = {foo} />
            <Text style={styles.balanceStyle}>Balance: {balance} vc</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    balanceStyle: {
        fontSize: 24,
        marginVertical: 50,
        alignSelf: 'center'
    }
});