import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { globalStyles } from "../styles/global";
import { Formik } from "formik";
import * as yup from "yup";

const reviewSchema = yup.object().shape({
  from: yup.string().required(),
  to: yup.string().required(),
  amount: yup.string().required(),
});

export default function TransactionForm({ addTransaction, userName }) {
  styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: "#fff",
    },
    textInput: {
      marginTop: 25,
      marginBottom: 100,
      padding: 10,
      flex: 1,
      justifyContent: "space-between",
    },
    form: {
      paddingVertical: 10,
      justifyContent: "space-evenly",
      flex: 1,
    },
    action: {
      fontSize: 18,
      backgroundColor: "white",
      paddingBottom: 10,
      borderBottomColor: "black",
      borderBottomWidth: 1,
      marginHorizontal: 10,
      marginTop: 16,
    },

    buttons: {
      backgroundColor: "#4f6cf6",
      paddingVertical: 16,
      marginTop: 22,
      marginHorizontal: 32,
      borderRadius: 14,
      justifyContent: "center",
    },
    buttonText: {
      color: "white",
      fontSize: 17,
      alignItems: "center",
      textAlign: "center",
    },
    prompt: {
      fontSize: 16,
      marginBottom: 8,
      marginLeft: 2,
    },
  });

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ from: userName, to: "", amount: "" }}
        validationSchema={reviewSchema}
        onSubmit={(values, actions) => {
          actions.resetForm();
          addTransaction(values);
        }}
      >
        {(props) => (
          <View style={styles.textInput}>
            <View>
              <Text
                style={{ color: "#374151", fontSize: 32, fontWeight: "700" }}
              >
                Make
              </Text>
              <Text
                style={{ color: "#374151", fontSize: 48, fontWeight: "700" }}
              >
                Payment
              </Text>
            </View>

            <View style={styles.form}>
              <View>
                <TextInput
                  style={styles.action}
                  placeholder="Enter the username of recipient"
                  onChangeText={props.handleChange("to")}
                  value={props.values.to}
                  onBlur={props.handleBlur("to")}
                />
                <Text style={globalStyles.errorText}>
                  {props.touched.to && props.errors.to}
                </Text>

                <TextInput
                  style={styles.action}
                  placeholder="Enter the amount"
                  onChangeText={props.handleChange("amount")}
                  value={props.values.amount}
                  keyboardType="number-pad"
                  onBlur={props.handleBlur("amount")}
                />
                <Text style={globalStyles.errorText}>
                  {props.touched.amount && props.errors.amount}
                </Text>
              </View>
              <View>
                <TouchableHighlight
                  style={styles.buttons}
                  underlayColor="#1E40AF"
                  onPress={props.handleSubmit}
                >
                  <Text style={styles.buttonText}>Send Money</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}
