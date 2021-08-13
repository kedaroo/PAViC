import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/global';
import db from '../database/database';

const Item = ( {title} ) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
);

export default function BlockScreen () {  

    const [blocks, setBlocks] = useState();

    useEffect(() => {
        db.transaction((tx) => {
            console.log('TRYING TO LOAD BLOCKS for BlockScreen...')
            tx.executeSql(
                'SELECT * FROM blocks',
                [], 
                (_tx, {rows: {_array} }) => {
                    console.log('LOADED BLOCKS:')
                    setBlocks(_array)
                    console.log(blocks)
                }, 
                () => console.log('Fetching BLOCKS FOR HISTORY FAILED!')
            )
        }, () => console.log('Fetching BLOCKS FOR HISTORY error'), () => console.log('Fetching BLOCKS FOR HISTORY SUCCESSFULL'));
    }, [])

    const renderItem = ({ item }) => (
        <Item title={`${item.id}\n${item.prev_hash} - ${item.hash} - ${item.nonce}`} />
    );

    return (
        <View style = {globalStyles.container} >
            <Text>Transaction History Screen</Text>
            <FlatList
                data={blocks}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
      backgroundColor: '#f9c2ff',
      padding: 6,
      marginVertical: 4,
      marginHorizontal: 4,
    },
    title: {
      fontSize: 16,
    },
  });
