import db from '../database/database';
import socket from '../service/socket';
import AsyncStorage from '@react-native-async-storage/async-storage';

function from(username) {
    return new Promise(function(resolve, reject) {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT SUM(amount) FROM transactions where from_add = ?',
                [username], 
                (_tx, {rows: {_array} }) => {
                    var result = _array[0]['SUM(amount)']
                    if (result == null) {
                        resolve(0)
                    } else {
                        resolve(_array[0]['SUM(amount)'])
                    }
                }, 
                () => console.log('Fetching FROM FAILED!')
            )
        }, () => console.log('7.1 FROM AMOUNT FETCH error'), () => console.log('7.1 FROM AMOUNT FETCH SUCCESSFULL'));
    })
}

function to(username) {
    return new Promise(function(resolve, reject) {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT SUM(amount) FROM transactions where to_add = ?',
                [username], 
                (_tx, {rows: {_array} }) => {
                    var result = _array[0]['SUM(amount)']
                    if (result == null) {
                        resolve(0)
                    } else {
                        resolve(_array[0]['SUM(amount)'])
                    }
                }, 
                () => console.log('Fetching TO FAILED!')
            )
        }, () => console.log('7.2 TO AMOUNT FETCH error'), () => console.log('7.2 TO AMOUNT FETCH SUCCESSFULL'));
    })
}

function fetchUserName() {
    return new Promise(async function(resolve, reject) {
        const token = await AsyncStorage.getItem('userToken')
        socket.emit("fetch username", JSON.parse(token).sub)
        socket.once("get username", args => {
            resolve(args)
        })
    })
}

const getBalance = () => {
    return new Promise( async function(resolve, reject) {
        var username = await fetchUserName()
        var from_amt = await from(username)
        var to_amt = await to(username)
        var balance = to_amt - from_amt
        resolve(balance)
    })
}

export default getBalance;