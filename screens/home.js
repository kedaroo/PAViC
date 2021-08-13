// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Modal, TouchableWithoutFeedback, Keyboard, Alert, Text, Image,
//     TouchableHighlight } from 'react-native';
// import { SHA256 } from 'crypto-js';
// import db from '../database/database';
// import socket from '../service/socket';
// import TransactionForm from './transactionForm';
// import { MaterialIcons } from '@expo/vector-icons';
// import getBalance from '../database/getBalance';
// import mineBlock from './mineTransactionsScreen';
// import { StatusBar } from 'expo-status-bar';
// import { LinearGradient } from 'expo-linear-gradient';

// export default function Home () {

//     const [modalOpen, setModalOpen] = useState(false)

//     const user = 'Siddhi'
//     const [balance, setBalance] = useState(1)
    
//     const fetchUserBalance = async (user) => {
//         var x = await getBalance(user)
//         console.log('THIS is fetched user BALANCE: ', x)
//         setBalance(x)
//     }

    

//     useEffect(() => {

//         socket.once("add new block", args => {
//             console.log('This is inside add new block event listner')
//             console.log('RECEIVED BLOCK:', args)
//             db.transaction((tx) => {
//                 tx.executeSql(
//                     'INSERT INTO blocks (prev_hash, hash, nonce) VALUES ((SELECT hash FROM blocks ORDER BY id DESC LIMIT 1), ?, ?)',
//                     args, 
//                     (_tx, {rows: {_array} }) => {
//                         console.log('INSERTED NEW BLOCK SUCCESSFULLY')
//                     }, 
//                     () => console.log('NEW BLOCK INSERT FAILED')
//                 )
//             }, () => console.log('ADD NEW BLOCK LISTENER error'), () => console.log('ADD NEW BLOCK SUCCESSFULL'));
//         })
        
//         socket.once("add new transactions", transactions => {
//             console.log('This is inside add new transactions event listner')
//             console.log('RECEIVED TRANSACTIONS: ', transactions)
//             db.transaction((tx) => {
//                 for (var i = 0; i < transactions.data.length; i++) {
//                     tx.executeSql(
//                         'INSERT INTO transactions (from_add, to_add, amount) VALUES (?, ?, ?)',
//                         [transactions.data[i].from_add, transactions.data[i].to_add, transactions.data[i].amount], 
//                         (_tx, {rows: {_array} }) => {
//                             console.log('Insert into transactions SUCCESFULL')
//                         }, 
//                         (tx, err) => console.log(err)
//                     )
//                 }
//                 fetchUserBalance(user)
//             }, () => console.log('TRANSACTIONS FETCH AND INSERT error'), () => console.log('TRANSACTIONS FETCH AND INSERT SUCCESSFULL'))
        
//             console.log('Deleting pending_transactions..')
//             db.transaction((tx) => {
//                 tx.executeSql(
//                     'delete from pending_transactions',
//                     [], 
//                     (_tx, {rows: {_array} }) => {
//                         console.log('PENDING TRANSACTIONS TABLE CLEARED SUCCESSFULLY')
//                     }, 
//                     (tx, err) => console.log(err)
//                 )
//               }, () => console.log('ADD NEW TRANSACTIONS LISTENER error'), () => console.log('ADD NEW TRANSACTIONS SUCCESSFULL'));
//         })

//         db.transaction((tx) => {
//             tx.executeSql(
//               'CREATE TABLE if NOT EXISTS blocks (id integer primary key AUTOINCREMENT, prev_hash text, hash text, nonce integer not null)', 
//                 [], 
//                 (_tx, {rows: {_array}}) => console.log('========CREATE TABLE blocks SUCCESSHULL'), 
//                 () => console.log('CREATE TABLE blocks FAILED!')
//             ),

//             tx.executeSql(
//                 'SELECT * FROM blocks',
//                 [],
//                 (_tx, {rows: {_array}}) => {
//                     if (_array.length == 0) {
//                         db.transaction((tx) => {
//                             tx.executeSql(
//                                 "INSERT INTO blocks (prev_hash, hash, nonce) VALUES (?, ?, ?)",
//                                 ['0', SHA256('0').toString(), 0],
//                                 (_tx, {rows: {_array}}) => console.log('GENESIS BLOCK INSERTED SUCCESSFULLY')
//                             )
//                         }, (tx, err) => console.log(err))
//                     }
//                 }
//             ),

//             tx.executeSql(
//                 'CREATE TABLE if NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, b_id INTEGER, from_add text, to_add text, amount integer)', 
//                   [], 
//                   (_tx, {rows: {_array}}) => console.log('CREATE TABLE transactions SUCCESSFULLL!'), 
//                   () => console.log('CREATE TABLE transactions FAILED!')
//             ),

//             tx.executeSql(
//                 'SELECT COUNT(*) FROM blocks',
//                 [],
//                 (_tx, {rows: {_array}}) => {
//                   console.log('FETCH BLOCKS EMITTED SUCCESSFULLYY')
//                   socket.emit("fetch blocks", _array[0]['COUNT(*)']);
//                 }
//             ),

//             tx.executeSql(
//                 'CREATE TABLE if NOT EXISTS pending_transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, from_add text, to_add text, amount integer)', 
//                   [], 
//                   (_tx, {rows: {_array}}) => console.log('CREATE TABLE pending_transactions SUCCESSFULLLLL BITCH!'), 
//                   () => console.log('CREATE TABLE pending_transactions FAILED!')
//             )
//         }, () => console.log('USE EFFECT TRANSACTION error'), () => console.log('USE EFFECT TRANSACTION SUCCESSFULL'));

        
//         fetchUserBalance(user)

//     }, []);

//     console.log('HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII')
//     fetchUserBalance(user)
    
//     const addTransaction = async (transaction) => {
//         var userBalance = await getBalance(transaction.from)
//         if (parseInt(transaction.amount) > userBalance) {
//             Alert.alert('Transaction Error', 'You have insufficient balance')
//             setModalOpen(false)
//             return
//         }
//         console.log('TRANSACTION emitted: ', transaction)
//         socket.emit("transaction", JSON.stringify(transaction));
//         setModalOpen(false)
//     }

//     return (
//         <View style={styles.container}>

//             <View style={styles.profileCard}>
//                 <View>
//                     <Text style={styles.hello}>Hello,</Text>
//                     <Text style={styles.userName}>{user}</Text>
//                 </View>

//                 <View>
//                     <Image 
//                         source={require('../assets/3.jpeg')} 
//                         style={styles.profilePic}
//                     ></Image>
//                 </View>
//             </View>

//             <LinearGradient
//                     colors={['#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'].reverse()}
//                     start={{ x: 0, y: 0}}
//                     end={{x: 1, y: 1}}
//                     style={styles.balanceCard}
//             >
//             {/* <View style={styles.balanceCard}> */}
//                 <Text style={styles.currentBalance}>Current Balance:</Text>
//                 <Text style={styles.amount}>{balance} vc</Text>
//             {/* </View> */}
//             </LinearGradient>

//             <View style={styles.buttonsCard}>
//                 <TouchableHighlight style={styles.buttons} underlayColor='#1E40AF' onPress = {() => mineBlock(2)}>
//                     {/* <View style={styles.buttons}> */}
//                         <Text style={styles.buttonText}>Mine</Text>
//                     {/* </View> */}
//                 </TouchableHighlight>

//                 <TouchableHighlight style={styles.buttons} underlayColor='#1E40AF' onPress = {() => setModalOpen(true)}>
//                     {/* <View style={styles.buttons}> */}
//                         <Text style={styles.buttonText}>Pay </Text>
//                     {/* </View> */}
//                 </TouchableHighlight>
//             </View>


//             <Modal visible = {modalOpen} animationType='slide' onRequestClose = {() => setModalOpen(false)} style = {styles.modal} >
//                  <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
//                      <View style={styles.modalContent}>
//                          <MaterialIcons 
//                             name = 'close'
//                             size = {24}
//                             onPress = {() => setModalOpen(false)}
//                             style = {{ ...styles.modalToggle, ...styles.modalClose}}
//                         />
//                         <TransactionForm addTransaction = {addTransaction}/>
//                     </View>
//                 </TouchableWithoutFeedback>
//             </Modal>
//             {/* <FlatButton onPress = {() => setModalOpen(true)} text = 'Make Payment' />
//             <FlatButton onPress = {() => navigation.navigate('TransactionHistoryScreen')} text = 'Transaction History' />
//             <FlatButton onPress = {() => navigation.navigate('ViewBalanceScreen')} text = 'View Balance'/>
//             <FlatButton onPress = {() => navigation.navigate('MineTransactionsScreen')} text = 'Mine Transactions'/>
//             <FlatButton onPress = {() => navigation.navigate('BlockScreen')} text = 'View Blocks'/> */}
//             <StatusBar style = 'auto' />
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 10,
//         // marginTop: 30,
//         paddingTop: 30,
//         backgroundColor: '#F9FAFB'
//         // justifyContent: 'space-between'
//     },  
//     modalToggle: {
//         marginBottom: 10,
//         borderWidth: 1,
//         borderColor: 'pink',
//         padding: 10,
//         borderRadius: 10,
//         alignSelf: 'center'
//     },
//     modalClose: {
//         marginTop: 20,
//         marginBottom: 0
//     },
//     modalContent: {
//         flex: 1,
//     },
//     modal: {
//         backgroundColor: 'green'
//     },


//     profileCard: {
//         // flex: 1,
//         flexDirection: 'row',
//         // marginTop: 60,
//         // marginHorizontal: 10,
//         // backgroundColor: 'yellow',
//         // opacity: 0.3,
//         // paddingHorizontal: 10,
//         // paddingVertical: 15, 
//         padding: 10,
//         // paddingHorizontal: 0,
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         // elevation: 15
//         // height: 50
//     },
//     hello: {
//         color: '#6B7280',
//         fontSize: 22,
//         // fontWeight: '600'
//     },
//     userName: {
//         color: '#4B5563',
//         marginTop: -6,
//         fontSize: 44,
//         fontWeight: '700'
//     },
//     profilePic: {
//         // flex: 1,
//         width: 100,
//         height: 100,
//         resizeMode: 'cover',
//         borderColor: 'blue',
//         borderRadius: 100
//     },


//     balanceCard: {
//         // flex: 1,
//         // flexDirection: 'column',
//         marginTop: 40,
//         // marginHorizontal: 10,
//         // backgroundColor: '#2563EB',
//         // opacity: 0.3,
//         marginHorizontal: 10,
//         paddingHorizontal: 20,
//         paddingVertical: 40, 
//         // justifyContent: 'space-between',
//         borderRadius: 20,
//         // justifyContent:
        
//         // elevation: 7
//     },
//     currentBalance: {
//         color: 'white',
//         fontSize: 18,
//     },
//     amount: {
//         color: 'white',
//         fontSize: 52,
//         // marginTop: -5,
//         fontWeight: 'bold'
//     },

//     buttonsCard: {
//         // flex: 1,
//         flexDirection: 'row',
//         marginTop: 80,
//         // marginHorizontal: 10,
//         // backgroundColor: 'green',
//         // opacity: 0.3,
//         // paddingHorizontal: 10,
//         // paddingVertical: 40,
//         padding: 10, 
//         justifyContent: 'space-around',
//         // alignSelf: 'flex-end'
//         // elevation: 15
//     },
//     buttons: {
//         backgroundColor: '#3B82F6',
//         paddingVertical: 12,
//         paddingHorizontal: 45,
//         borderRadius: 5,
//         justifyContent: 'center',
//         elevation: 5
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 18,
//         alignItems: 'center'
//     },
// })
