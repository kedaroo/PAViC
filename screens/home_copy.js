import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  Image,
  TouchableHighlight,
  ImageBackground,
  ToastAndroid,
} from "react-native";
import db from "../database/database";
import socket from "../service/socket";
import getBalance from "../database/getBalance";
import mineBlock from "./mineTransactionsScreen";
import { StatusBar } from "expo-status-bar";
import startUp from "../database/db_func";
import * as Animatable from "react-native-animatable";
import { TouchableOpacity } from "react-native";
import { Tooltip } from "react-native-elements";
import { AuthContext } from "../components/context";
import getReward from "../database/getReward";

export default function Home({ route, navigation }) {
  const image = JSON.parse(route.params.token).picture;
  const sub = JSON.parse(route.params.token).sub;

  const [renderTimes, setRenderTimes] = useState(0);
  const [userName, setUserName] = useState("");
  const [balance, setBalance] = useState("...");
  const [reward, setReward] = useState("...");
  const [pendingTransactions, setPendingTransactions] = useState(0);
  const [mineButtonText, setMineButtonText] = useState("Fetch Transactions");

  const { signOut } = useContext(AuthContext);

  const mineButtonHandler = () => {
    if (mineButtonText == "Fetch Transactions") {
      socket.emit("fetch pending transactions");
      socket.once("pending transactions", (Transactions) => {
        setPendingTransactions(Transactions.data.length);
        if (Transactions.data.length > 0) {
          setMineButtonText("Mine Transactions");
        } else {
          ToastAndroid.show(
            "No pending transactions currently available",
            ToastAndroid.SHORT
          );
        }
      });
    } else {
      ToastAndroid.show("Mining started...", ToastAndroid.SHORT);
      mineBlock(3, userName);
      setMineButtonText("Fetch Transactions");
      setPendingTransactions(0);
    }
  };

  const initializeBalance = async () => {
    var x = await startUp();
    setBalance(x);
    var y = await getReward();
    setReward(y);
  };

  const updateBalance = async () => {
    var x = await getBalance();
    setBalance(x);
    var y = await getReward();
    setReward(y);
  };

  useEffect(() => {
    setRenderTimes(renderTimes + 1);

    const fetchUserName = () => {
      socket.emit("fetch username", sub);
      socket.once("get username", (args) => {
        setUserName(args);
      });
    };

    fetchUserName();

    socket.on("add new user", (args) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "INSERT INTO users (user_id, picture, username) VALUES (?, ?, ?)",
            args,
            (_tx, { rows }) => {
              console.log("INSERTED NEW USER SUCCESSFULLY::", rows);
            },
            () => console.log("NEW USER INSERT FAILED")
          );
        },
        () => console.log("ADD NEW USER LISTENER error"),
        () => console.log("ADD NEW USER SUCCESSFULL")
      );
    });

    socket.on("add new block", (args) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "INSERT INTO blocks (prev_hash, hash, nonce) VALUES ((SELECT hash FROM blocks ORDER BY id DESC LIMIT 1), ?, ?)",
            args,
            (_tx, { rows }) => {
              console.log("INSERTED NEW BLOCK SUCCESSFULLY::", rows);
            },
            () => console.log("NEW BLOCK INSERT FAILED")
          );
        },
        () => console.log("ADD NEW BLOCK LISTENER error"),
        () => console.log("ADD NEW BLOCK SUCCESSFULL")
      );
    });

    socket.on("add new transactions", (transactions) => {
      db.transaction(
        (tx) => {
          for (var i = 0; i < transactions.data.length; i++) {
            tx.executeSql(
              "INSERT INTO transactions (from_add, to_add, amount) VALUES (?, ?, ?)",
              [
                transactions.data[i].from_add,
                transactions.data[i].to_add,
                transactions.data[i].amount,
              ],
              (_tx, { rows }) => {
                console.log("Insert into transactions SUCCESFULL::", rows);
              },
              (tx, err) => console.log(err)
            );
          }
          updateBalance();
        },
        () => console.log("TRANSACTIONS FETCH AND INSERT error"),
        () => console.log("TRANSACTIONS FETCH AND INSERT SUCCESSFULL")
      );

      db.transaction(
        (tx) => {
          tx.executeSql(
            "delete from pending_transactions",
            [],
            (_tx, { rows: { _array } }) => {
              console.log("PENDING TRANSACTIONS TABLE CLEARED SUCCESSFULLY");
            },
            (tx, err) => console.log(err)
          );
        },
        () => console.log("ADD NEW TRANSACTIONS LISTENER error"),
        () => console.log("ADD NEW TRANSACTIONS SUCCESSFULL")
      );
    });

    initializeBalance();

    return function cleanup() {
      socket.removeAllListeners("add new users");
      socket.removeAllListeners("add new block");
      socket.removeAllListeners("add new transactions");
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View>
          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        <View>
          <Tooltip
            popover={
              <TouchableOpacity onPress={() => signOut()} activeOpacity={0.8}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                    }}
                  >
                    Log Out
                  </Text>
                </View>
              </TouchableOpacity>
            }
            backgroundColor="#4160f3"
          >
            <Image source={{ uri: image }} style={styles.profilePic} />
          </Tooltip>
        </View>
      </View>

      <Animatable.View animation="pulse" iterationCount={3}>
        <ImageBackground
          source={require("../assets/cardBg.png")}
          style={styles.balanceCard}
          imageStyle={{ borderRadius: 32 }}
        >
          <Text style={styles.currentBalance}>Balance</Text>
          <Text style={styles.amount}>{balance} vc</Text>
          <Text style={{ ...styles.currentBalance, marginTop: 14 }}>
            Mining Reward
          </Text>
          <Text style={{ ...styles.amount, fontSize: 36 }}>{reward} vc</Text>
        </ImageBackground>
      </Animatable.View>

      <View>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            paddingHorizontal: 10,
            color: "#4B5563",
            paddingTop: 24,
          }}
        >
          Mine Transactions
        </Text>
        <View style={styles.miningCard}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                ...styles.currentBalance,
                fontSize: 20,
                color: "#4B5563",
              }}
            >
              Pending Transactions:
            </Text>
            <Text style={{ ...styles.amount, fontSize: 24, color: "#4B5563" }}>
              {pendingTransactions}
            </Text>
          </View>
          <TouchableHighlight
            style={styles.buttons}
            underlayColor="#1E40AF"
            onPress={() => mineButtonHandler()}
          >
            <Text style={styles.buttonText}>{mineButtonText}</Text>
          </TouchableHighlight>
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 30,
    marginBottom: 100,
    justifyContent: "space-around",
  },
  miningCard: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 24,
    padding: 20,
    marginVertical: 10,
  },
  modalToggle: {
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "pink",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  modalClose: {
    marginTop: 40,
    marginBottom: 40,
  },
  modalContent: {
    flex: 1,
  },
  modal: {
    flex: 1,
    backgroundColor: "green",
  },
  profileCard: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcome: {
    color: "#6B7280",
    fontSize: 18,
  },
  userName: {
    color: "#4B5563",
    fontSize: 28,
    fontWeight: "700",
  },
  profilePic: {
    width: 60,
    height: 60,
    resizeMode: "cover",
    borderColor: "blue",
    borderRadius: 20,
  },
  balanceCard: {
    marginTop: 8,
    marginHorizontal: 10,
    padding: 18,
  },
  currentBalance: {
    color: "white",
    fontSize: 18,
  },
  amount: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },

  buttonsCard: {
    flexDirection: "row",
    marginTop: 80,
    padding: 10,
    justifyContent: "space-around",
  },
  buttons: {
    backgroundColor: "#4f6cf6",
    paddingVertical: 12,
    marginTop: 22,
    marginHorizontal: 32,
    borderRadius: 14,
    justifyContent: "center",
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    alignItems: "center",
    textAlign: "center",
  },
});
