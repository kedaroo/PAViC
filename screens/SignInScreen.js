import React, { useState, useContext } from 'react';
import {
    View, 
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Platform,
    TextInput
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AuthContext } from '../components/context';

export default function SignInScreen({ navigation }) {

    const [data, setData] = useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true
    })

    const { signIn } = useContext(AuthContext);

    const textInputChange = (val) => {
        if (val.length != 0) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true
            })
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false
            })
        }
    }

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        })
    }

    const updateSecureTestEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        })
    }

    const loginHandle = (username, password) => {
        signIn(username, password);
    }

    return (
        <View style={styles.container}>
            <StatusBar style='auto'/>
            <View style={styles.header}>
                <Text style={styles.text_header} >Welcome!</Text>
            </View>

            <Animatable.View 
                animation='fadeInUpBig'
                style={styles.footer}
            >
                <Text style={styles.text_footer} >Email</Text>
                <View style={styles.action}>
                    <FontAwesome 
                        name="user-o"
                        color={'black'}
                        size={20}
                    />
                    <TextInput 
                        placeholder='Your Email'
                        style={styles.textInput}
                        autoCapitalize='none'
                        onChangeText={(val) => textInputChange(val)}
                    />
                    {data.check_textInputChange ?  

                    <Animatable.View
                        animation='bounceIn'
                    >
                        <Feather 
                            name='check-circle'
                            color = 'green'
                            size={20}
                        />
                    </Animatable.View>
                    
                    : null}
                </View>

                <Text style={[styles.text_footer,
                        {marginTop: 35}]} >Password</Text>

                <View style={styles.action}>
                    <Feather 
                        name="lock"
                        color={'black'}
                        size={20}
                    />
                    <TextInput 
                        placeholder='Your Password'
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={styles.textInput}
                        autoCapitalize='none'
                        onChangeText={(val) => handlePasswordChange(val)}
                    />
                    <TouchableOpacity
                        onPress={updateSecureTestEntry}
                    >
                        {data.secureTextEntry ? 
                            <Feather 
                                name='eye-off'
                                color = 'grey'
                                size={20}
                            />
                            :
                            <Feather 
                                name='eye'
                                color = 'grey'
                                size={20}
                            />
                        }
                    </TouchableOpacity>
                </View>

                <View style={styles.Button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => {loginHandle(data.username, data.password)}}
                    >
                        <LinearGradient
                            colors={['pink', 'violet']}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, {
                                color: 'white'
                            }]}>Sign In</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    

                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignUpScreen')}
                        style={[styles.signIn, {
                            borderColor: 'violet',
                            borderWidth: 1,
                        }]}
                    >
                        <Text style={[styles.textSign, {
                            color: 'violet'
                        }]} >Sign Up</Text>
                    </TouchableOpacity>
                </View>

            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: 'pink'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
  });