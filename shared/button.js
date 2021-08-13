import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';

export default function FlatButton({ text, onPress }) {

    return (
        <TouchableOpacity onPress = {onPress}>
            <View style = {styles.button}>
                <Text style = {styles.buttonText} >{text}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        marginTop: 40,
        marginHorizontal: 30,
    },

    buttonText: {
        color: 'black',
        textTransform: 'uppercase',
        fontSize: 18,
        textAlign: 'center'
    }
})