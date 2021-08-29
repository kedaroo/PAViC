import db from '../database/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

function from(username) {
    return new Promise(function(resolve, reject) {
        db.transaction((tx) => {
            tx.executeSql(
                // 'SELECT SUM(amount) FROM transactions where from_add = 0',
                'select sum(amount) from transactions where from_add = "Reward" and to_add = ?',
                [username], 
                (_tx, {rows: {_array} }) => {
                    console.log('THIS IS THE FROM IN fetch reward')
                    // console.log(_array[0]['SUM(amount)'])
                    console.log(_array[0]['sum(amount)'])
                    var result = _array[0]['sum(amount)']
                    if (result == null) {
                        console.log('REWARD FETCHED AS FOLLOWS:: ')
                        resolve(0)
                    } else {
                        console.log('REWARD FETCHED AS FOLLOWS:: ')
                        resolve(_array[0]['sum(amount)'])
                    }
                }, 
                () => console.log('Fetching REWARD FAILED!')
            )
        }, () => console.log('7.1 REWARD FETCH error'), () => console.log('6.9 REWARD FETCH SUCCESSFULL'));
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

const getReward = () => {
    return new Promise( async function(resolve, reject) {
        var username = await fetchUserName()
        var reward = await from(username)
        // console.log('THIS IS INSIDE getBalance. THIS IS BALANCE BELOW')
        console.log('7.3 REWARD FETCHED AS FOLLOWS::')
        console.log(reward)
        // console.log('THIS IS BALANCE TYPE: ', typeof balance)
        resolve(reward)
    })
}

export default getReward;