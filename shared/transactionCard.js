import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function TransactionCard(props) {

    if (props.children.from_add == props.userName) {
        var placeholder = props.children.to_add
        var logo = require('../assets/outgoing.png')
        var bg = '#FEE2E2'
    } else {
        var placeholder = props.children.from_add
        var logo = require('../assets/incoming.png')
        var bg = '#D1FAE5'
    }

    styles = StyleSheet.create({
        container: {
            marginVertical: 10,
            marginHorizontal: 10,
            paddingVertical: 10,
            paddingHorizontal: 10,
            flexDirection: 'row',
            backgroundColor: 'white',
            justifyContent: 'space-between',
            borderRadius: 12 
        },  
        logoView: {
            padding: 10,
            backgroundColor: bg,
            borderRadius: 30,
            alignSelf: 'center',
        },  
        logo: {
            height: 20,
            width: 20,
            alignSelf: 'center'
        },
        details: {
            flex: 1,
            marginHorizontal: 20,
            justifyContent: 'space-between',
            alignSelf: 'center',
        },  
        userName: {
            color: '#374151',
            fontSize: 20,
            fontWeight: 'bold',
            
        },
        timestamp: {
            color: '#6B7280',
            fontSize: 12
        },
        amountView: {
            alignSelf: 'center',   
        },
        amount: {
            color: '#374151',
            fontSize: 24,
            fontWeight: 'bold',
        },
        vc: {
            fontSize: 12
        }
    })

    return (
        <View style={styles.container}>
            <View style={styles.logoView}>
                <Image
                    source={logo}
                    style={styles.logo}
                ></Image>
            </View>

            <View style={styles.details}>
                <View>
                    <Text style={styles.userName}>{placeholder}</Text>
                </View>
            </View>

            <View style={styles.amountView}>
                <Text style={styles.amount}>{props.children.amount}</Text>
            </View>
        </View>
    )
}

