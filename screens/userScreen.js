import React, { useContext } from 'react';
import { FlatList, StyleSheet, Text, View, Image, Button, TouchableOpacity, NativeModules } from 'react-native';
import { AuthContext } from '../components/context';
import Auth0 from 'react-native-auth0';


export default function UserScreen({ route }) {

    const auth0 = new Auth0({ domain: 'dev-6deskpi9.us.auth0.com', clientId: 'icHaPvJhCgZFFdIHov7myIO6EYeQjYxc' });
    
    const name = JSON.parse(route.params.token).name
    const image = JSON.parse(route.params.token).picture
    console.log(JSON.parse(route.params.token))

    const { signOut } = useContext(AuthContext)

    const logMeOut = async () => {
        auth0.webAuth
        .clearSession({})
        .then(success => {
            Alert.alert(
                'Logged out!'
            );
        this.setState({ accessToken: null });
        })
        .catch(error => {
            console.log('Log out cancelled');
        });
      };


    styles = StyleSheet.create({
        container: {
            // marginVertical: 40,
            paddingVertical: 40,
            flex: 1,
            // justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
            // justifyContent = 'space-between',
            backgroundColor: '#F9FAFB'
        },  
        profileCard: {
            backgroundColor: '#F9FAFB',
            flexDirection: 'row',
            // marginTop: 30,
            marginHorizontal: 10,
            // backgroundColor: 'black',
            // opacity: 0.3,
            paddingHorizontal: 10,
            paddingVertical: 10, 
        },
        nameCard: {
            backgroundColor: '#F9FAFB',
            // marginTop: 10,
            marginHorizontal: 10,
            // backgroundColor: 'white',
            paddingHorizontal: 20,
            paddingVertical: 10, 
            borderRadius: 10,
        },
        emailCard: {
        
            // backgroundColor: 'black',
            // opacity: 0.3
        },
        email: {
            fontSize: 18,
            color: '#1E3A8A',
        },
        buttonsCard: {
            // flex: 1,
            flexDirection: 'row',
            // marginTop: 40,
            marginHorizontal: 10,
            // backgroundColor: 'white',
            // opacity: 0.3,
            paddingHorizontal: 10,
            paddingVertical: 40, 
            // justifyContent: 'space-between',
            // elevation: 15
        },
        buttons: {
            // backgroundColor: '#374151',
            backgroundColor: '#2563EB',
            paddingVertical: 10,
            paddingHorizontal: 42,
            borderRadius: 8
        },
        buttonText: {
            color: 'white',
            fontSize: 18,
        },  
        hello: {
            color: '#6B7280',
            fontSize: 22,
            fontWeight: 'bold'
        },
        userName: {
            color: '#374151',
            // marginTop: -10,
            fontSize: 48,
            fontWeight: 'bold'
        },
        name: {
            color: '#1E3A8A',
            // marginTop: -10,
            fontSize: 35,
            fontWeight: 'bold',
            textAlign: 'center'
        },
        profilePic: {
            width: 150,
            height: 150,
            resizeMode: 'cover',
            borderColor: 'blue',
            borderRadius: 225,
        },
    })
    return (
        <View style={styles.container}>
            <View style={styles.profileCard}>
                    <Image 
                        style={styles.profilePic}
                        // source={require('../assets/3.jpeg')} 
                        source={{uri: image}} 
                    ></Image>
            </View>

            <View style={styles.nameCard}>
                <Text style={styles.name}>{name}</Text>
            </View>

            {/* <View style={styles.emailCard}>
                <Text style={styles.email}>platypus_perry@gmail.com</Text>                
            </View> */}


            <View style={styles.buttonsCard}>
                {/* <View style={styles.buttons}> */}
                    <TouchableOpacity style={styles.buttons} onPress={() => signOut()}>
                    {/* <TouchableOpacity style={styles.buttons} onPress={() => logMeOut()}> */}
                    
                        <Text style={styles.buttonText}>Sign out</Text>
                    </TouchableOpacity>
                {/* </View> */}
            </View>

            {/* <NavBar/> */}


        </View>
    )
}

// styles = StyleSheet.create({
//     container: {
//         marginVertical: 40,
//         flex: 1,
//         // justifyContent: 'center',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'space-around',
//         // justifyContent = 'space-between'
//     },  
//     profileCard: {
//         flexDirection: 'row',
//         // marginTop: 30,
//         marginHorizontal: 10,
//         // backgroundColor: 'black',
//         // opacity: 0.3,
//         paddingHorizontal: 10,
//         paddingVertical: 10, 
//         // justifyContent: 'space-between',
//     },
//     nameCard: {
//         // marginTop: 10,
//         marginHorizontal: 10,
//         // backgroundColor: 'white',
//         paddingHorizontal: 20,
//         paddingVertical: 10, 
//         borderRadius: 10,
//     },
//     emailCard: {
    
//         // backgroundColor: 'black',
//         // opacity: 0.3
//     },
//     email: {
//         fontSize: 18,
//         color: '#374151',
//     },
//     buttonsCard: {
//         // flex: 1,
//         flexDirection: 'row',
//         // marginTop: 40,
//         marginHorizontal: 10,
//         // backgroundColor: 'white',
//         // opacity: 0.3,
//         paddingHorizontal: 10,
//         paddingVertical: 40, 
//         // justifyContent: 'space-between',
//         // elevation: 15
//     },
//     buttons: {
//         backgroundColor: '#374151',
//         paddingVertical: 10,
//         paddingHorizontal: 42,
//         borderRadius: 8
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 18,
//     },  
//     hello: {
//         color: '#6B7280',
//         fontSize: 22,
//         fontWeight: 'bold'
//     },
//     userName: {
//         color: '#374151',
//         // marginTop: -10,
//         fontSize: 48,
//         fontWeight: 'bold'
//     },
//     name: {
//         color: '#374151',
//         // marginTop: -10,
//         fontSize: 35,
//         fontWeight: 'bold',
//         textAlign: 'center'
//     },
//     profilePic: {
//         flex: 1,
//         width: 225,
//         height: 225,
//         resizeMode: 'contain',
//         borderColor: 'blue',
//         borderRadius: 100
//     },
// })