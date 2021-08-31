import React from "react";
import { View, Alert } from "react-native";
import TransactionForm from "./transactionForm";
import socket from "../service/socket";
import getBalance from "../database/getBalance";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MakePaymentScreen({ route, navigation }) {
  const userName = "user";

  function fetchUserName() {
    return new Promise(async function (resolve, reject) {
      const token = await AsyncStorage.getItem("userToken");
      socket.emit("fetch username", JSON.parse(token).sub);
      socket.once("get username", (args) => {
        resolve(args);
      });
    });
  }

  const addTransaction = async (transaction) => {
    var userBalance = await getBalance();
    var userName = await fetchUserName();
    transaction.from = userName;
    if (parseInt(transaction.amount) > userBalance) {
      Alert.alert("Transaction Error", "You have insufficient balance");
      return;
    }
    socket.once("transaction acknowledgement", (data) => {
      Alert.alert("", data.message);
    });
    socket.emit("transaction", transaction);
  };

  return (
    <View style={{ flex: 1 }}>
      <TransactionForm addTransaction={addTransaction} userName={userName} />
    </View>
  );
}
