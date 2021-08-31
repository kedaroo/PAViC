import React, { useEffect, useMemo, useReducer } from "react";
import { View, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import socket from "./service/socket";

// screens
import TransactionHistoryScreen from "./screens/transactionHistoryScreen";
import HomeStackScreen from "./screens/homeStack";
import MakePaymentScreen from "./screens/makePaymentScreen";
import SignInScreen from "./screens/SignInScreen2";
import RootStackScreen from "./screens/RootStackScreen";

// Auth
import { AuthContext } from "./components/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
const auth0ClientId = "icHaPvJhCgZFFdIHov7myIO6EYeQjYxc";
const authorizationEndpoint = "https://dev-6deskpi9.us.auth0.com/logout";
const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

const Tab = createBottomTabNavigator();

export default function App() {
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    isNewUser: false,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
        };
      case "REGISTER":
        return {
          ...prevState,
          userToken: action.token,
          isNewUser: true,
          isLoading: false,
        };
      case "HOMESTACK":
        return {
          ...prevState,
          isNewUser: false,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = useMemo(
    () => ({
      signIn: async (userToken) => {
        let token;
        token = null;
        try {
          token = JSON.stringify(userToken);
          await AsyncStorage.setItem("userToken", token);
        } catch (e) {
          console.log(e);
        }

        socket.emit("user_registration", userToken);
        socket.once("user login", async (args) => {
          if (!args.isNewUser) {
            dispatch({ type: "LOGIN", token: token });
          } else {
            dispatch({ type: "REGISTER", token: token });
          }
        });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem("userToken");
        } catch (e) {
          console.log(e);
        }
        promptAsync({ useProxy: true, redirectUri });
        dispatch({ type: "LOGOUT" });
      },
      signUp: async (username) => {
        const token = await AsyncStorage.getItem("userToken");
        socket.emit("add username", [username, JSON.parse(token).sub]);
        dispatch({ type: "HOMESTACK" });
      },
    }),
    []
  );

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: auth0ClientId,
      responseType: "id_token",
      scopes: ["openid", "profile", "email"],
      extraParams: {
        nonce: "nonceassa",
      },
    },
    { authorizationEndpoint }
  );

  console.log(`Redirect URL: ${redirectUri}`);

  useEffect(() => {
    bootStrapAsync = async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem("userToken");
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "RETRIEVE_TOKEN", token: userToken });
    };
    bootStrapAsync();
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  const CustomButton = ({ children, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        top: -20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 35,
          backgroundColor: "#4161f4",
          elevation: 6,
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );

  if (loginState.isNewUser) {
    return (
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <SignInScreen />
        </NavigationContainer>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.userToken != null ? (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === "Home") {
                  iconName = "home";
                } else if (route.name === "Recent Transactions") {
                  iconName = "ios-receipt";
                } else if (route.name === "My Profile") {
                  iconName = "person";
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "#4363f4",
              tabBarInactiveTintColor: "gray",
              headerShown: false,
              tabBarShowLabel: false,
              tabBarStyle: {
                height: 60,
                elevation: 0,
                position: "absolute",
              },
            })}
          >
            <Tab.Screen
              name="Home"
              component={HomeStackScreen}
              initialParams={{ token: loginState.userToken }}
            />
            <Tab.Screen
              options={{
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={require("./assets/plus.png")}
                    resizeMode="contain"
                    style={{
                      width: 32,
                      height: 32,
                      tintColor: "white",
                    }}
                  />
                ),
                tabBarButton: (props) => <CustomButton {...props} />,
              }}
              name="Transaction Form"
              component={MakePaymentScreen}
              initialParams={{ token: loginState.userToken }}
            />
            <Tab.Screen
              name="Recent Transactions"
              component={TransactionHistoryScreen}
              initialParams={{ token: loginState.userToken }}
            />
          </Tab.Navigator>
        ) : (
          <RootStackScreen />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
