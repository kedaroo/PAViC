import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TodoItem({item}) {
    return (
        <TouchableOpacity>
            <View style = {styles.item} >
                <MaterialIcons name = 'delete' size = {18} color = '#e75480'/>
                <Text style = {styles.itemStyle}> {item.title} </Text>
            </View>
            
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    item: {
        padding: 16,
        marginTop: 16, 
        borderColor: 'pink',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 15,
        flexDirection: 'row',
    },
    itemStyle: {
        marginLeft: 8
    }
})