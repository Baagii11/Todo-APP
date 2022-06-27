import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import Button from "../components/Button";
import LabeledInput from "../components/LabeledInput";
import Colors from "../constants/Colors";
import validator from "validator";
import { auth, firestore } from "firebase";
import { Ionicons } from "@expo/vector-icons";

const validateFields = (email, password) => {
    const isValid = {
        email: validator.isEmail(email),
        password: validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }),
    };

    return isValid;
};

const login = (email, password) => {
    auth()
        .signInWithEmailAndPassword(email, password)
        .then(( {} ) => {
            console.log("Logged in!");
        });
};

const createAccount = (email, password, name) => {
    auth()
        .createUserWithEmailAndPassword(email, password)
        .then(({ user }) => {
            if(user){
                user.updateProfile({
                  displayName: name
                })
              }
            console.log("Creating user...");
            firestore().collection("users").doc(user.uid).set({});
        });
};

export default () => {
    const email = <Ionicons name={"mail-outline"} size={20}/>;
    const test = require("../assets/login-password.png");
    const loginPassword = <Image source={test} style={{height: 20, width: 20}}/>;
    const username = <Ionicons name={"person-outline"} size={20}/>;
    const [isCreateMode, setCreateMode] = useState(false);
    const [nameField, setNameField] = useState({
        text: "",
        errorMessage: "",
    });
    const [emailField, setEmailField] = useState({
        text: "",
        errorMessage: "",
    });
    const [passwordField, setPasswordField] = useState({
        text: "",
        errorMessage: "",
    });
    const [passwordReentryField, setPasswordReentryField] = useState({
        text: "",
        errorMessage: "",
    });
    return (
        <View style={styles.container}>
            <Image source={require("../assets/image1.jpg")}
                   style={{position: "absolute"}}/>
            <Text style={styles.header}>Task management</Text>
            <View style={{ flex: 1}}>
                 {isCreateMode && (              
                    <LabeledInput
                        label={username}
                        text={nameField.text}
                        placeholder="Хэрэглэгчийн нэр"
                        onChangeText={(text) => {
                            setNameField({ text });
                        }}
                        errorMessage={nameField.errorMessage}
                        labelStyle={styles.label}
                        autoCompleteType="text"
                    />
                )}  
                <LabeledInput
                    label={email}
                    text={emailField.text}
                    placeholder="Имэйл хаяг"
                    onChangeText={(text) => {
                        setEmailField({ text });
                    }}
                    errorMessage={emailField.errorMessage}
                    labelStyle={styles.label}
                    autoCompleteType="email"
                />
                <LabeledInput
                    label={loginPassword}
                    text={passwordField.text}
                    placeholder="Нууц үг"
                    onChangeText={(text) => {
                        setPasswordField({ text });
                    }}
                    secureTextEntry={true}
                    errorMessage={passwordField.errorMessage}
                    labelStyle={styles.label}
                    autoCompleteType="password"
                />
                {isCreateMode && (              
                    <LabeledInput
                        label={loginPassword}
                        text={passwordReentryField.text}
                        placeholder="Нууц үгээ дахин оруулна уу"
                        onChangeText={(text) => {
                            setPasswordReentryField({ text });
                        }}
                        secureTextEntry={true}
                        errorMessage={passwordReentryField.errorMessage}
                        labelStyle={styles.label}
                    />
                )}                
                <TouchableOpacity
                    onPress={() => {
                        setCreateMode(!isCreateMode);
                    }}
                >
                    <Text
                        style={{
                            alignSelf: "center",
                            color: "#000",
                            fontSize: 16,
                            margin: 4,
                            fontFamily: "PTSerif"
                        }}
                    >
                        {isCreateMode
                            ? "Нэвтрэх"
                            : "Бүртгэл үүсгэх"}
                    </Text>
                </TouchableOpacity>
            </View>
            <Button
                onPress={() => {
                    const isValid = validateFields(
                        emailField.text,
                        passwordField.text
                    );
                    let isAllValid = true;
                    if (!isValid.email) {
                        emailField.errorMessage = "Хүчинтэй имэйл оруулна уу";
                        setEmailField({ ...emailField });
                        isAllValid = false;
                    }

                    if (!isValid.password) {
                        passwordField.errorMessage =
                            "Нууц үг нь 8 ширхэг тоо, жижиг болон том үсэг, тэмдэгт агуулсан байна";
                        setPasswordField({ ...passwordField });
                        isAllValid = false;
                    }

                    if (
                        isCreateMode &&
                        passwordReentryField.text != passwordField.text
                    ) {
                        passwordReentryField.errorMessage =
                            "Нууц үг тохирохгүй байна";
                        setPasswordReentryField({ ...passwordReentryField });
                        isAllValid = false;
                    }

                    if (isAllValid) {
                        isCreateMode
                            ? createAccount(emailField.text, passwordField.text, nameField.text)
                            : login(emailField.text, passwordField.text);
                    }
                }}
                buttonStyle={{ backgroundColor: Colors.orange, fontFamily: "PTSerif"}}
                text={isCreateMode ? "Бүртгэл үүсгэх" : "Нэвтрэх"}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "space-between",
        alignItems: "stretch",
    },
    // label: { height: 1, width: 1, fontSize: 16, fontWeight: "bold", color: "#fff" , fontStyle: "italic",},
    header: { fontSize: 33, color: "orange", 
              alignSelf: "center", marginBottom: 100, 
              marginTop: 50, fontFamily: "Florsn", fontWeight: "bold"},
    label: {
        height: 20,
        width: 20,
        fontFamily: "Cormorant",
        fontSize: 18
    }
});