import React from 'react';
import { FlatList, StyleSheet, Text, View, Image, Button, TouchableOpacity } from 'react-native';

export default function TransactionCard(props) {

    // var users = props.users;
    // console.log('THIS IS INSIDE TRANSACTION CARD: ', users)

    if (props.children.from_add == props.userName) {
        // console.log('NAME:::::::::::::::::::::', users[props.children.to_add])
        // var placeholder = props.children.to_add
        var placeholder = props.children.to_add
        var logo = require('../assets/outgoing.png')
        var bg = '#FEE2E2'
    } else {
        // console.log('NAME:::::::::::::::::::::', users[props.children.from_add])
        // var placeholder = props.children.from_add
        var placeholder = props.children.from_add
        var logo = require('../assets/incoming.png')
        var bg = '#D1FAE5'
    }

    styles = StyleSheet.create({
        container: {
            // flex: 1,
            marginVertical: 10,
            marginHorizontal: 10,
            paddingVertical: 10,
            paddingHorizontal: 10,
            flexDirection: 'row',
            backgroundColor: 'white',
            // opacity: 0.3,
            justifyContent: 'space-between',
            borderRadius: 12 
        },  
        logoView: {
            padding: 10,
            // backgroundColor: '#D1FAE5',
            backgroundColor: bg,
            borderRadius: 30,
            alignSelf: 'center',
            // backgroundColor: 'yellow'
        },  
        logo: {
            height: 20,
            width: 20,
            alignSelf: 'center'
        },
        details: {
            flex: 1,
            // backgroundColor: 'orange',
            marginHorizontal: 20,
            justifyContent: 'space-between',
            alignSelf: 'center',
        },  
        userName: {
            color: '#374151',
            // marginTop: -10,
            fontSize: 18,
            fontWeight: 'bold',
            
        },
        timestamp: {
            color: '#6B7280',
            fontSize: 12
        },
        amountView: {
            alignSelf: 'center',   
            // backgroundColor: 'pink'
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
                {/* <View>
                    <Text style={styles.timestamp}>13:56 6 June, 2020</Text>
                </View> */}
            </View>

            <View style={styles.amountView}>
                {/* <Text style={styles.vc}>vc</Text> */}
                <Text style={styles.amount}>{props.children.amount}</Text>
            </View>
        </View>
    )
}

