import * as SQLite from 'expo-sqlite';
import socket from '../service/socket';

const db = SQLite.openDatabase('ddsshai.db');

// socket.once("update blocks", blocks => {
//     console.log('This is inside UPDATE BLOCKS listener')
//     if (blocks.data.length != 0) {
//         console.log(blocks)
//         for (let block of blocks.data) {
//             db.transaction((tx) => {
//                 tx.executeSql(
//                     "INSERT INTO blocks (prev_hash, hash, nonce) VALUES (?, ?, ?)",
//                     [block.prev_hash, block.hash, block.nonce],
//                     // (_tx, {rows: {_array}}) => console.log(_array)
//                 )
//             })
//         }
//     }
// })

// socket.once("update transactions", transactions => {
//     console.log('This is inside UPDATE TRANSACTIONS listener')
//     console.log(transactions)
//     if (transactions.data.length != 0) {
//         console.log('This is inside IF')
//         for (let transaction of transactions.data) {
//             db.transaction((tx) => {
//                 tx.executeSql(
//                     "INSERT INTO transactions (b_id, from_add, to_add, amount) VALUES (?, ?, ?, ?)",
//                     [transaction.b_id, transaction.from_add, transaction.to_add, transaction.amount],
//                     // (_tx, {rows: {_array}}) => console.log(_array)
//                 )
//             })
//         }
//     }
// })

export default db;