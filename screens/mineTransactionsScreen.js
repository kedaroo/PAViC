import React from 'react';
import { Alert } from 'react-native';
import socket from '../service/socket';
import db from '../database/database';
import { SHA256 } from 'crypto-js';


// fetching pending transactions
function fetchPendingTransactions(username) {
    return new Promise(function(resolve, reject) {
        socket.emit("fetch pending transactions", null);
        socket.once("pending transactions", Transactions => {
            db.transaction((tx) => {
                for (var i = 0; i < Transactions.data.length; i++) {
                    tx.executeSql(
                        'INSERT INTO pending_transactions (from_add, to_add, amount) VALUES (?, ?, ?)',
                        [Transactions.data[i].from_add, Transactions.data[i].to_add, Transactions.data[i].amount], 
                        (_tx, {rows: {_array} }) => {
                            console.log('Insert into pending_transactions SUCCESFULL')
                        }, 
                        (tx, err) => console.log(err)
                    )
                }
                tx.executeSql(
                    'INSERT INTO pending_transactions (from_add, to_add, amount) VALUES (?, ?, ?)',
                    ['Reward', username, 100], 
                    (_tx, {rows: {_array} }) => {
                        console.log('Insert MINING REWARD into pending_transactions SUCCESFULL')
                    }, 
                    (tx, err) => console.log(err)
                )
            }, () => console.log('PENDING TRANSACTIONS FETCH AND INSERT error'), () => console.log('PEDNING_TRANSACTION FETCH AND INSERT SUCCESSFULL'))
            console.log("LOOK HEREEEEEEEEEEEEEEEEEEEEEE::::::::", Transactions.data)
            resolve([Transactions.data, [0, mobile, 500]])
        });
    });
}

// fetching previous hash
function fetchPrevHash() {
    return new Promise(function(resolve, reject) {
        // fetching prevHash
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT hash FROM blocks ORDER BY id DESC LIMIT 1',
                [], 
                (_tx, {rows: {_array} }) => {
                    console.log('PREV_HASH FETCHED')
                    resolve(_array[0].hash)
                }, 
                () => console.log('Fetching prev_hash FAILED!')
            )
        }, () => console.log('FETCH PREV_HASH error'), () => console.log('FETCH PREV_HASH SUCCESSFULL'));
    })
}

const mineBlock = async (difficulty, username) => {

    console.log('============================================================')
    console.log('mineBlock FUNCTION INVOKED')

    var prevHash = '';
    var counter = 0;

    console.log('FETCHING PREV_HASH')

    prevHash = await fetchPrevHash();

    console.log('FETCHED PREV_HASH: ', prevHash)
    console.log('FETCHED PREV_HASH TYPE: ', typeof prevHash)

    console.log('FETCHING PENDING TRANSACTIONS')

    var pending_transactions = await fetchPendingTransactions(username);

    if (pending_transactions.length == 0) {
        Alert.alert('Mining Error', 'There are no pending Transactions to mine')
        return
    }
    
    console.log('PENDING TRANSACTIONS FETCHED: ', pending_transactions)

    socket.disconnect()

    console.log('STARTING MINING PROCESS')

    var hashString = '1234678910';
    
    while (hashString.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
        counter++;            
        hashString = SHA256(prevHash + JSON.stringify(pending_transactions) + counter).toString();
    }

    console.log('MINING PROCESS FINISHED')

    socket.emit("block mined", [prevHash, hashString, counter, ['0', username, 100]]);

    socket.connect()
}

export default mineBlock;
