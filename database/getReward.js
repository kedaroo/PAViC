import db from '../database/database';

function from(mobile) {
    return new Promise(function(resolve, reject) {
        db.transaction((tx) => {
            tx.executeSql(
                // 'SELECT SUM(amount) FROM transactions where from_add = 0',
                'select sum(amount) from transactions where from_add = 0 and to_add = ?',
                [mobile], 
                (_tx, {rows: {_array} }) => {
                    console.log('THIS IS THE FROM IN fetch reward')
                    // console.log(_array[0]['SUM(amount)'])
                    console.log(_array[0]['sum(amount)'])
                    var result = _array[0]['sum(amount)']
                    if (result == null) {
                        console.log('REWARD FETCHED ')
                        resolve(0)
                    } else {
                        console.log('REWARD FETCHED')
                        resolve(_array[0]['sum(amount)'])
                    }
                }, 
                () => console.log('Fetching REWARD FAILED!')
            )
        }, () => console.log('7.1 error'), () => console.log('6.9 SUCCESSFULL'));
    })
}

const getReward = (mobile) => {
    return new Promise( async function(resolve, reject) {
        var reward = await from(mobile)
        // console.log('THIS IS INSIDE getBalance. THIS IS BALANCE BELOW')
        console.log('7.3 REWARD FETCHED')
        console.log(reward)
        // console.log('THIS IS BALANCE TYPE: ', typeof balance)
        resolve(reward)
    })
}

export default getReward;