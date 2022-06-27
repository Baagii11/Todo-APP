import React from "react";
import { View, Image, Text} from "react-native";
import Button from "../components/Button";
import { auth } from "firebase";
import { Calendar } from "expo";

export default () => {
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <Text>Calendar</Text>
        </View>
    );
};
