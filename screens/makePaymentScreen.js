import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { globalStyles } from '../styles/global';
import TransactionForm from './transactionForm';
import socket from '../service/socket';
import getBalance from '../database/getBalance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MakePaymentScreen ({route, navigation}) {

    // const mobile = route.params.mobile
    const sub = JSON.parse(route.params.token).sub

    // const [userName, setUserName] = useState('user')
    const userName = 'user'
    // const fetchUserName = () => {
    //     socket.emit("fetch username", sub)    
    //     socket.once("get username", args => {
    //         setUserName(args)
    //     })
    // }
    
    // useEffect(() => {
    //     fetchUserName()
    // }, [])

    function fetchUserName() {
        return new Promise(async function(resolve, reject) {
            const token = await AsyncStorage.getItem('userToken')
            console.log('This is inside fetch username. sub sent::', JSON.parse(token).sub)
            socket.emit("fetch username", JSON.parse(token).sub)
            socket.once("get username", args => {
                console.log('This is inside fetch username. username received::', args)
                resolve(args)
            })
        })
    }

    const addTransaction = async (transaction) => {
        var userBalance = await getBalance()
        var userName = await fetchUserName()
        transaction.from = userName
        if (parseInt(transaction.amount) > userBalance) {
            Alert.alert('Transaction Error', 'You have insufficient balance')
            return
        }
        socket.once("transaction acknowledgement", data => {
            Alert.alert('', data.message)
        })
        console.log('TRANSACTION emitted: ', transaction)
        socket.emit("transaction", transaction);
    }

    return (
        <View style={{flex:1}}>
            <TransactionForm addTransaction = {addTransaction} userName={userName}/>
        </View>
    )
}