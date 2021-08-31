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
                    // console.log('THIS IS THE FROM')
                    // console.log(_array[0]['SUM(amount)'])
                    var result = _array[0]['SUM(amount)']
                    if (result == null) {
                        console.log('FROM AMOUNT::')
                        resolve(0)
                    } else {
                        console.log('FROM AMOUNT::')
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
                    // console.log('THIS IS THE TO')
                    // console.log(_array[0]['SUM(amount)'])
                    var result = _array[0]['SUM(amount)']
                    if (result == null) {
                        console.log('TO AMOUNT::')
                        resolve(0)
                    } else {
                        console.log('TO AMOUNT::')
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
        console.log('This is inside fetch username. sub sent::', JSON.parse(token).sub)
        socket.emit("fetch username", JSON.parse(token).sub)
        socket.once("get username", args => {
            console.log('This is inside fetch username. username received::', args)
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
        // console.log('THIS IS INSIDE getBalance. THIS IS BALANCE BELOW')
        console.log('7.3 BALANCE FETCHED AS FOLLOWS::')
        console.log(balance)
        // console.log('THIS IS BALANCE TYPE: ', typeof balance)
        resolve(balance)
    })
}

export default getBalance;