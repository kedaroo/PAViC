import db from '../database/database';

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
                        console.log('FROM FETCHED')
                        resolve(0)
                    } else {
                        console.log('FROM FETCHED')
                        resolve(_array[0]['SUM(amount)'])
                    }
                }, 
                () => console.log('Fetching FROM FAILED!')
            )
        }, () => console.log('7.1 error'), () => console.log('7.1 SUCCESSFULL'));
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
                        console.log('TO FETCHED')
                        resolve(0)
                    } else {
                        console.log('TO FETCHED')
                        resolve(_array[0]['SUM(amount)'])
                    }
                }, 
                () => console.log('Fetching TO FAILED!')
            )
        }, () => console.log('7.2 error'), () => console.log('7.2 SUCCESSFULL'));
    })
}

const getBalance = (username) => {
    return new Promise( async function(resolve, reject) {
        var from_amt = await from(username)
        var to_amt = await to(username)
        var balance = to_amt - from_amt
        // console.log('THIS IS INSIDE getBalance. THIS IS BALANCE BELOW')
        console.log('7.3 BALANCE FETCHED')
        console.log(balance)
        // console.log('THIS IS BALANCE TYPE: ', typeof balance)
        resolve(balance)
    })
}

export default getBalance;