import React, { useState } from "react";
import { View, Image, Text, StyleSheet, useEffect} from "react-native";
import Button from "../components/Button";
import Login from "./Login";
import { firestore, auth } from "firebase";
import firebase from "firebase/app";
import { color } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export default () => {

    try {
        var email = firebase.auth().currentUser.email;
        var name = firebase.auth().currentUser.displayName;
    } catch (err) {
        console.log(err.message);
    }
    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <Image source={require("../assets/image1.jpg")}
                   style={{position: "absolute"}}/>
            <Image source={require("../assets/lisitem.webp")}
                   style={{position: "absolute", height: 530    , marginTop: 280}}/>
            <Image style={styles.pic} source={require("../assets/profile2.webp")}/>
            <Text style={styles.container}><Ionicons name={"person"} size={20}/> <Text style={{color: "#000", fontStyle: "normal", fontFamily: "Cormorant"}}>{"  " + name}</Text></Text>
            <Text style={styles.container2}><Ionicons name={"mail"} size={20}/> <Text style={{color: "#000", fontStyle: "normal", fontFamily: "Cormorant"}}>{"  " + email}</Text></Text>
            <Button
                buttonStyle={styles.buttonS}
                text="Гарах"
                onPress={() => {
                    auth().signOut();
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        fontSize: 22,
        textAlign: "left",
        justifyContent: "flex-start",
        marginTop: 20,
        marginLeft: 20,
        color: "#A9551F",
        fontStyle: "italic",    },
    container2: {
        fontSize: 22,
        textAlign: "left",
        justifyContent: "flex-start",
        marginTop: 20,
        marginLeft: 20,
        color: "#A9551F",
        marginBottom: 420,
        fontStyle: "italic",
    },
    pic: {
        height: 150,
        width: 150,
        backgroundColor: "#fff",
        marginTop: 20,
        marginLeft: 130,
        borderRadius: 200,
        borderWidth: 1,
        borderColor: "#A9551F"
    },
    buttonS: {
        fontFamily: "Roman"
    }
});
