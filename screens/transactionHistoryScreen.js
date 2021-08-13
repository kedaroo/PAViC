import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, useCallback } from 'react-native';
import db from '../database/database';
import TransactionCard from '../shared/transactionCard';

export default function TransactionHistoryScreen ({ route }) {  

    const mobile = route.params.mobile

    const [transactions, setTransactions] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [users, setUsers] = useState()

    const loadUsers = () => {
        db.transaction((tx) => {
            console.log('TRYING TO LOAD USERS FOR HistoryScreen...')
            tx.executeSql(
                'SELECT name, mobile FROM users',
                [], 
                (_tx, {rows: {_array} }) => {
                    console.log('LOADED USERS:')
                    for (var i = 0; i < _array.length; i++) {
                        console.log(i)
                    }
                    setUsers(_array.reverse())
                    console.log(users)
                }, 
                () => console.log('Fetching USERS FOR HISTORY FAILED!')
            )
        }, () => console.log('Fetching USERS FOR HISTORY error'), () => console.log('Fetching USERS FOR HISTORY SUCCESSFULL'));
      }


    const refreshTransactions = () => {
        setRefreshing(true);
        db.transaction((tx) => {
            console.log('TRYING TO LOAD TRANSACTION FOR HistoryScreen...')
            tx.executeSql(
                'SELECT * FROM transactions where from_add = ? or to_add = ?',
                [mobile, mobile], 
                (_tx, {rows: {_array} }) => {
                    console.log('LOADED TRANSACTIONS:')
                    setTransactions(_array.reverse())
                    // console.log(transactions)
                }, 
                () => console.log('Fetching TRANSACTION FOR HISTORY FAILED!')
            )
        }, () => console.log('Fetching TRANSACTION FOR HISTORY error'), () => console.log('Fetching TRANSACTION FOR HISTORY SUCCESSFULL'));
        setRefreshing(false)
      }

      const loadTransactions = () => {
        db.transaction((tx) => {
            console.log('TRYING TO LOAD TRANSACTION FOR HistoryScreen...')
            tx.executeSql(
                'SELECT * FROM transactions where from_add = ? or to_add = ?',
                [mobile, mobile], 
                (_tx, {rows: {_array} }) => {
                    console.log('LOADED TRANSACTIONS:')
                    setTransactions(_array.reverse())
                    // console.log(transactions)
                }, 
                () => console.log('Fetching TRANSACTION FOR HISTORY FAILED!')
            )
        }, () => console.log('Fetching TRANSACTION FOR HISTORY error'), () => console.log('Fetching TRANSACTION FOR HISTORY SUCCESSFULL'));
    }

    useEffect(() => {

        loadTransactions()
        loadUsers()

        // socket.on("add new transactions", transactions => {
        //     console.log('This is inside add new transactions event listner in TRANSACTION HISTORY SCREEN')
        //     loadTransactions()
        // })        

    }, [])

    return (
        <View style = {styles.container} >

            <Text style={styles.title}>Recent Transactions</Text>

            <FlatList 
                data={transactions}
                renderItem={({item}) => (
                    <TransactionCard mobile={mobile}>{item}</TransactionCard> 
                )}
                onRefresh={refreshTransactions}
                refreshing={refreshing}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 20,
        backgroundColor: '#F9FAFB'
    },  
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginVertical: 10,
      marginHorizontal: 10
    },
  });
