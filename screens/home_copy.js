import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableWithoutFeedback, Keyboard, Alert, Text, Image,
    TouchableHighlight } from 'react-native';
import { SHA256 } from 'crypto-js';
import db from '../database/database';
import socket from '../service/socket';
import TransactionForm from './transactionForm';
import { MaterialIcons } from '@expo/vector-icons';
import getBalance from '../database/getBalance';
import mineBlock from './mineTransactionsScreen';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import startUp from '../database/db_func';
import * as Animatable from 'react-native-animatable';


export default function Home ({ route, navigation }) {

    const [modalOpen, setModalOpen] = useState(false)
    // console.log('GIVEN NAME:::::', JSON.parse(route.params.token).given_name)
    const user = JSON.parse(route.params.token).given_name
    const image = JSON.parse(route.params.token).picture
    const userId = JSON.parse(route.params.token).sub
    const mobile = route.params.mobile
    console.log('0000000000000000000000000000000000000000000000000000000',mobile)

    // const user = 'Siddhi'
    // const [user, setUser] = useState('')
    // console.log(props.initialParams)
    // const { userName } = route.params
    // const userName = route.params.userName

    // const user = userName
    const [balance, setBalance] = useState('Loading...')
    const [users, setUsers] = useState()
    
    const fetchUserBalance = async (user) => {
        var x = await startUp(user)
        console.log('THIS is fetched user BALANCE: ', balance)
        setBalance(x)
    }

    const fetchUserBalance2 = async (user) => {
        var x = await getBalance(user)
        console.log('THIS is fetched user BALANCE: ', x)
        setBalance(x)
    }

    // getMyObject = async () => {
    //     try {
    //       const jsonValue = await AsyncStorage.getItem('userToken')
    //       const token = JSON.parse(jsonValue)
    //       setUser(token.given_name)
    //     // setUser('Siddhi')
    //       console.log(token.given_name)
    //     //   return jsonValue != null ? JSON.parse(jsonValue) : null
    //     } catch(e) {
    //       console.log(e)
    //     }  
    // }

    // getMyObject()

    const loadUsers = () => {
        db.transaction((tx) => {
            console.log('TRYING TO LOAD USERS FOR HistoryScreen...')
            tx.executeSql(
                'SELECT name, mobile FROM users',
                [], 
                (_tx, {rows: {_array} }) => {
                    console.log('LOADED USERS:')
                    var dict = []
                    for (var i = 0; i < _array.length; i++) {
                        dict.push(_array[i].name)
                    }
                    setUsers(dict)
                    console.log(users)
                }, 
                () => console.log('Fetching USERS FOR HISTORY FAILED!')
            )
        }, () => console.log('Fetching USERS FOR HISTORY error'), () => console.log('Fetching USERS FOR HISTORY SUCCESSFULL'));
      }
    
      
    //   console.log(users)


    useEffect(() => {

        console.log('ADD NEW USER LISTENER SUCCESS================================================================')

        socket.on("add new user", args => {
            console.log('I booooooooooooooooooommmmmmmmmmmmmmmmmmmmmmmm')
            console.log('This is inside add new user event listner')
            console.log('RECEIVED USER:', args)
            db.transaction((tx) => {
                tx.executeSql(
                    'INSERT INTO users (name, user_id, picture, mobile) VALUES (?, ?, ?, ?)',
                    args,
                    (_tx, {rows }) => {
                        console.log('INSERTED NEW USER SUCCESSFULLY::', rows)
                    }, 
                    () => console.log('NEW USER INSERT FAILED')
                )
            }, () => console.log('ADD NEW USER LISTENER error'), () => console.log('ADD NEW USER SUCCESSFULL'));
        })

        console.log('ADD NEW BLOCK LISTENER SUCCESS================================================================')

        socket.on("add new block", args => {
            console.log('I RANNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN')
            console.log('This is inside add new block event listner')
            console.log('RECEIVED BLOCK:', args)
            db.transaction((tx) => {
                tx.executeSql(
                    'INSERT INTO blocks (prev_hash, hash, nonce) VALUES ((SELECT hash FROM blocks ORDER BY id DESC LIMIT 1), ?, ?)',
                    args, 
                    (_tx, {rows }) => {
                        console.log('INSERTED NEW BLOCK SUCCESSFULLY::', rows)
                    }, 
                    () => console.log('NEW BLOCK INSERT FAILED')
                )
            }, () => console.log('ADD NEW BLOCK LISTENER error'), () => console.log('ADD NEW BLOCK SUCCESSFULL'));
        })

        console.log('ADD NEW TRANSACTIONSS LISTER SUCCESS===================================================')
        
        socket.on("add new transactions", transactions => {
            console.log('I RAN TOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO')
            console.log('This is inside add new transactions event listner')
            console.log('RECEIVED TRANSACTIONS: ', transactions)
            db.transaction((tx) => {
                for (var i = 0; i < transactions.data.length; i++) {
                    tx.executeSql(
                        'INSERT INTO transactions (from_add, to_add, amount) VALUES (?, ?, ?)',
                        [transactions.data[i].from_add, transactions.data[i].to_add, transactions.data[i].amount], 
                        (_tx, {rows }) => {
                            console.log('Insert into transactions SUCCESFULL::', rows)
                        }, 
                        (tx, err) => console.log(err)
                    )
                }
                fetchUserBalance2(mobile)
            }, () => console.log('TRANSACTIONS FETCH AND INSERT error'), () => console.log('TRANSACTIONS FETCH AND INSERT SUCCESSFULL'))
        
            console.log('Deleting pending_transactions..')
            db.transaction((tx) => {
                tx.executeSql(
                    'delete from pending_transactions',
                    [], 
                    (_tx, {rows: {_array} }) => {
                        console.log('PENDING TRANSACTIONS TABLE CLEARED SUCCESSFULLY')
                    }, 
                    (tx, err) => console.log(err)
                )
              }, () => console.log('ADD NEW TRANSACTIONS LISTENER error'), () => console.log('ADD NEW TRANSACTIONS SUCCESSFULL'));



              db.transaction((tx) => {
                tx.executeSql(
                    'select * from blocks',
                    [], 
                    (_tx, {rows }) => {
                        console.log('THE BLOCKS::', rows)
                    }, 
                    () => console.log('NEW BLOCK INSERT FAILED')
                )
            }, () => console.log('ADD NEW BLOCK LISTENER error'), () => console.log('ADD NEW BLOCK SUCCESSFULL'));

            db.transaction((tx) => {
                tx.executeSql(
                    'select * from transactions',
                    [], 
                    (_tx, {rows }) => {
                        console.log('THE BLOCKS::', rows)
                    }, 
                    () => console.log('NEW BLOCK INSERT FAILED')
                )
            }, () => console.log('ADD NEW BLOCK LISTENER error'), () => console.log('ADD NEW BLOCK SUCCESSFULL'));
        })

        console.log('FETCHUSERBALANCE CALLLED:=========================================================')

        fetchUserBalance(mobile)
        loadUsers()
        console.log(users)

    }, []);

    // console.log('HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII')
    // fetchUserBalance(user)
    
    const addTransaction = async (transaction) => {
        var userBalance = await getBalance(transaction.from)
        if (parseInt(transaction.amount) > userBalance) {
            Alert.alert('Transaction Error', 'You have insufficient balance')
            setModalOpen(false)
            return
        }
        socket.once("transaction acknowledgement", data => {
            Alert.alert('',data.message)
        })
        console.log('TRANSACTION emitted: ', transaction)
        socket.emit("transaction", transaction);
        setModalOpen(false)
    }

    return (
        <View style={styles.container}>

            <View style={styles.profileCard}>
                <View>
                    <Text style={styles.hello}>Hello,</Text>
                    <Text style={styles.userName}>{user}</Text>
                </View>

                <View>
                    <Image 
                        source={{uri: image}} 
                        style={styles.profilePic}
                    ></Image>
                </View>
            </View>

            <Animatable.View animation='pulse' iterationCount={4}>
                <LinearGradient
                    colors={['#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'].reverse()}
                    start={{ x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={styles.balanceCard}
                >
                    <Text style={styles.currentBalance}>Current Balance:</Text>
                    <Text style={styles.amount}>{balance} vc</Text>
                </LinearGradient>
            </Animatable.View>

            

            <View style={styles.buttonsCard}>
                <TouchableHighlight style={styles.buttons} underlayColor='#1E40AF' onPress = {() => mineBlock(2)}>
                        <Text style={styles.buttonText}>Mine</Text>
                </TouchableHighlight>

                <TouchableHighlight style={styles.buttons} underlayColor='#1E40AF' onPress = {() => setModalOpen(true)}>
                        <Text style={styles.buttonText}>Pay </Text>
                </TouchableHighlight>
            </View>


            <Modal visible = {modalOpen} animationType='slide' onRequestClose = {() => setModalOpen(false)} style = {styles.modal} >
                 <TouchableWithoutFeedback onPress = {Keyboard.dismiss} style = {styles.modal}>
                     <View style={styles.modalContent}>
                     <MaterialIcons 
                            name = 'close'
                            size = {24}
                            onPress = {() => setModalOpen(false)}
                            style = {{ ...styles.modalToggle, ...styles.modalClose}}
                        />
                     <TransactionForm addTransaction = {addTransaction} mobile={mobile} users={users}/>
                         
                        
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <StatusBar style = 'auto' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 30,
        backgroundColor: '#F9FAFB'
    },  
    modalToggle: {
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'pink',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center'
    },
    modalClose: {
        marginTop: 40,
        marginBottom: 40
    },
    modalContent: {
        flex: 1,
        // backgroundColor: 'pink'
    },
    modal: {
        flex: 1,
        backgroundColor: 'green'
    },
    profileCard: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hello: {
        color: '#6B7280',
        fontSize: 22,
    },
    userName: {
        color: '#4B5563',
        marginTop: -6,
        fontSize: 44,
        fontWeight: '700'
    },
    profilePic: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderColor: 'blue',
        borderRadius: 100
    },
    balanceCard: {
        marginTop: 40,
        marginHorizontal: 10,
        paddingHorizontal: 20,
        paddingVertical: 40, 
        borderRadius: 20,
    },
    currentBalance: {
        color: 'white',
        fontSize: 18,
    },
    amount: {
        color: 'white',
        fontSize: 52,
        fontWeight: 'bold'
    },

    buttonsCard: {
        flexDirection: 'row',
        marginTop: 80,
        padding: 10, 
        justifyContent: 'space-around',
    },
    buttons: {
        backgroundColor: '#3B82F6',
        paddingVertical: 12,
        paddingHorizontal: 45,
        borderRadius: 50,
        justifyContent: 'center',
        elevation: 5
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        alignItems: 'center'
    },
})
