import socket from '../service/socket';
import db from '../database/database';
import { SHA256 } from 'crypto-js';

// fetching pending transactions
function fetchPendingTransactions() {
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
            }, () => console.log('PENDING TRANSACTIONS FETCH AND INSERT error'), () => console.log('PEDNING_TRANSACTION FETCH AND INSERT SUCCESSFULL'))
            resolve(Transactions.data)
        });
    });
}

// fetching previous hash
function fetchPrevHash() {
    return new Promise(function(resolve, reject) {
        // fetching prevHash
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT prev_hash FROM blocks ORDER BY id DESC LIMIT 1',
                [], 
                (_tx, {rows: {_array} }) => {
                    console.log('PREV_HASH FETCHED')
                    resolve(_array[0].prev_hash)
                }, 
                () => console.log('Fetching prev_hash FAILED!')
            )
        }, () => console.log('FETCH PREV_HASH error'), () => console.log('FETCH PREV_HASH SUCCESSFULL'));
    })
}

const mineBlock = async (difficulty) => {

    console.log('============================================================')
    console.log('mineBlock FUNCTION INVOKED')

    var prevHash = '';
    var counter = 0;

    console.log('FETCHING PREV_HASH')

    prevHash = await fetchPrevHash();

    console.log('FETCHED PREV_HASH: ', prevHash)
    console.log('FETCHED PREV_HASH TYPE: ', typeof prevHash)

    console.log('FETCHING PENDING TRANSACTIONS')

    var pending_transactions = await fetchPendingTransactions();
    
    console.log('PENDING TRANSACTIONS FETCHED: ', pending_transactions)

    socket.disconnect()

    console.log('STARTING MINING PROCESS')

    var hashString = '1234678910';
    
    while (hashString.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
        counter++;            
        hashString = SHA256(prevHash + JSON.stringify(pending_transactions) + counter).toString();
    }

    console.log('MINING PROCESS FINISHED')

    socket.emit("block mined", [hashString, counter]);

    socket.connect()
}

export default mineBlock;
