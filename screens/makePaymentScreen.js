import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { globalStyles } from '../styles/global';
import TransactionForm from './transactionForm';
import socket from '../service/socket';
import getBalance from '../database/getBalance';

export default function MakePaymentScreen ({route, navigation}) {

    // const mobile = route.params.mobile
    const sub = JSON.parse(route.params.token).sub

    const [userName, setUserName] = useState('yash123456')
    const fetchUserName = () => {
        socket.emit("fetch username", sub)    
        socket.once("get username", args => {
            setUserName(args)
        })
    }
    
    // useEffect(() => {
    //     fetchUserName()
    // }, [])

    const addTransaction = async (transaction) => {
        var userBalance = await getBalance(transaction.from)
        if (parseInt(transaction.amount) > userBalance) {
            Alert.alert('Transaction Error', 'You have insufficient balance')
            // setModalOpen(false)
            return
        }
        socket.once("transaction acknowledgement", data => {
            Alert.alert('', data.message)
        })
        console.log('TRANSACTION emitted: ', transaction)
        socket.emit("transaction", transaction);
        // setModalOpen(false)
    }

    return (
        <View style={{flex:1}}>
            <TransactionForm addTransaction = {addTransaction} userName={userName}/>
        </View>
    )
}