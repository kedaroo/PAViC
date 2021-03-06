import { SHA256 } from "crypto-js";
import db from "../database/database";
import socket from "../service/socket";
import getBalance from "./getBalance";

function createUsersTable() {
  return new Promise(function (resolve, reject) {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "CREATE TABLE if NOT EXISTS users (id integer primary key AUTOINCREMENT, user_id text unique, picture text, username text unique)",
          [],
          (_tx, { rows }) => {
            resolve(rows);
          },
          () => console.log("CREATE TABLE users FAILED!")
        );
      },
      () => console.log("0 CREATE TABLE users error"),
      () => console.log("0 CREATE TABLE users SUCCESSFULL")
    );
  });
}

function updateUsers() {
  return new Promise(function (resolve, reject) {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT COUNT(*) FROM users",
          [],
          (_tx, { rows: { _array } }) => {
            socket.emit("fetch users", _array[0]["COUNT(*)"]);
          }
        );
      },
      () => console.log("0.1 Update users error"),
      () => console.log("0.1 UPDATE USERS SUCCESSFULL")
    );

    socket.once("update users", (users) => {
      if (users.data.length != 0) {
        for (let user of users.data) {
          db.transaction((tx) => {
            tx.executeSql(
              "INSERT INTO users (user_id, picture, username) VALUES (?, ?, ?)",
              [user.user_id, user.picture, user.username],
              (_tx, { rows: { _array } }) => console.log(_array)
            );
          });
        }
        resolve(users);
      } else {
        resolve(users);
      }
    });
  });
}

function createBlocksTable() {
  return new Promise(function (resolve, reject) {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "CREATE TABLE if NOT EXISTS blocks (id integer primary key AUTOINCREMENT, prev_hash text, hash text, nonce integer not null)",
          [],
          (_tx, { rows }) => {
            resolve(rows);
          },
          () => console.log("CREATE TABLE blocks FAILED!")
        );
      },
      () => console.log("1 create table blocks error"),
      () => console.log("1 create table blocks SUCCESSFULL")
    );
  });
}

function addGenesisBlock() {
  return new Promise(function (resolve, reject) {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM blocks",
          [],
          (_tx, { rows: { _array } }) => {
            if (_array.length == 0) {
              db.transaction(
                (tx) => {
                  tx.executeSql(
                    "INSERT INTO blocks (prev_hash, hash, nonce) VALUES (?, ?, ?)",
                    ["0", SHA256("0").toString(), 0],
                    (_tx, { rows: { _array } }) => {
                      resolve(_array);
                    }
                  );
                },
                (tx, err) => console.log(err)
              );
            } else {
              resolve(_array);
            }
          }
        );
      },
      () => console.log("2 error"),
      () => console.log("2 SUCCESSFULL")
    );
  });
}

function createTransactionsTable() {
  return new Promise(function (resolve, reject) {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "CREATE TABLE if NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, b_id INTEGER, from_add text, to_add text, amount integer)",
          [],
          (_tx, { rows: { _array } }) => {
            resolve(_array);
          },
          () => console.log("CREATE TABLE transactions FAILED!")
        );
      },
      () => console.log("3 create table transactions error"),
      () => console.log("3 create table transactions SUCCESSFULL")
    );
  });
}

function updateBlocks() {
  return new Promise(function (resolve, reject) {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT COUNT(*) FROM blocks",
          [],
          (_tx, { rows: { _array } }) => {
            socket.emit("fetch blocks", _array[0]["COUNT(*)"]);
          }
        );
      },
      () => console.log("4 error"),
      () => console.log("4 SUCCESSFULL")
    );

    socket.once("update blocks", (blocks) => {
      if (blocks.data.length != 0) {
        for (let block of blocks.data) {
          db.transaction((tx) => {
            tx.executeSql(
              "INSERT INTO blocks (prev_hash, hash, nonce) VALUES (?, ?, ?)",
              [block.prev_hash, block.hash, block.nonce],
              (_tx, { rows: { _array } }) => console.log(_array)
            );
          });
        }
        resolve(blocks);
      } else {
        resolve(blocks);
      }
    });
  });
}

function updateTransactions() {
  return new Promise(function (resolve, reject) {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT COUNT(*) FROM transactions",
          [],
          (_tx, { rows: { _array } }) => {
            socket.emit("fetch transactions", _array[0]["COUNT(*)"]);
          }
        );
      },
      () => console.log("5 ipdate transactions error"),
      () => console.log("5 ipdate transactions SUCCESSFULL")
    );

    socket.once("update transactions", (transactions) => {
      if (transactions.data.length != 0) {
        for (let transaction of transactions.data) {
          db.transaction((tx) => {
            tx.executeSql(
              "INSERT INTO transactions (b_id, from_add, to_add, amount) VALUES (?, ?, ?, ?)",
              [
                transaction.b_id,
                transaction.from_add,
                transaction.to_add,
                transaction.amount,
              ],
              (_tx, { rows: { _array } }) => console.log(_array)
            );
          });
        }
        resolve(transactions);
      } else {
        resolve(transactions);
      }
    });
  });
}

function createPendingTransactionsTable() {
  return new Promise(function (resolve, reject) {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "CREATE TABLE if NOT EXISTS pending_transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, from_add text, to_add text, amount integer)",
          [],
          (_tx, { rows: { _array } }) => {
            resolve(_array);
          },
          () => console.log("CREATE TABLE pending_transactions FAILED!")
        );
      },
      () => console.log("6 create table pending transactions error"),
      () => console.log("6 create table pending transactions SUCCESSFULL")
    );
  });
}

const startUp = () => {
  return new Promise(async function (resolve, reject) {
    // CREATE TABLE OF USERS
    var usersTable = await createUsersTable();

    // FETCH USERS
    var fetchBlocks = await updateUsers();

    // CREATE TABLE OF BLOCKS
    var blocksTable = await createBlocksTable();

    // INSERT GENESIS BLOCK
    var genesisBlock = await addGenesisBlock();

    // CREATE TABLE OF TRANSACTIONS
    var transactionsTable = await createTransactionsTable();

    // FETCH BLOCKS
    var fetchBlocks = await updateBlocks();

    // FETCH TRANSACTIONS
    var fetchTransactions = await updateTransactions();

    // CREATE TABLE OF PENDING TRANSACTIONS
    var pendingTransactionsTable = await createPendingTransactionsTable();

    var balance = await getBalance();

    resolve(balance);
  });
};

export default startUp;
