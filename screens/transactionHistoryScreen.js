import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import db from '../database/database';
import TransactionCard from '../shared/transactionCard';

export default function TransactionHistoryScreen ({ route }) {  

    const sub = JSON.parse(route.params.token).sub
    

    const [userName, setUserName] = useState('')
    socket.emit("fetch username", sub)    
    socket.once("get username", args => {
        setUserName(args)
    })

    const [transactions, setTransactions] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const refreshTransactions = () => {
        setRefreshing(true);
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM transactions where from_add = ? or to_add = ?',
                [userName, userName], 
                (_tx, {rows: {_array} }) => {
                    setTransactions(_array.reverse())
                }, 
                () => console.log('Fetching TRANSACTION FOR HISTORY FAILED!')
            )
        }, () => console.log('Fetching TRANSACTION FOR HISTORY error'), () => console.log('Fetching TRANSACTION FOR HISTORY SUCCESSFULL'));
        setRefreshing(false)
      }

    useEffect(() => {

    }, [])

    return (
        <View style = {styles.container} >

            <View style={{padding: 10, marginTop: 10}}>
                <Text style={{color: '#374151', fontSize: 24, fontWeight: '700'}}>Recent</Text>
                <Text style={{color: '#374151', fontSize: 38, fontWeight: '700'}}>Transactions</Text>
            </View>

            
        
            <View style={{flex:1}}>
                <FlatList 
                    data={transactions}
                    renderItem={({item}) => (
                        <TransactionCard userName={userName} >{item}</TransactionCard> 
                    )}
                    onRefresh={refreshTransactions}
                    refreshing={refreshing}
                />
            </View>
        </View>
    )
}
const {height} = Dimensions.get("screen");
const height_logo = height * 0.6;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 20,
        paddingBottom: 100,
    },  
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginVertical: 10,
      marginHorizontal: 10
    },
    imageContainer: {
        flex:1,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    image: {
        resizeMode: 'contain',
        padding: 0,
        flex:1,
        height: height_logo,
        width: height_logo
    },
    message :{
        color: 'gray',
        fontSize: 20,
    }
  });
