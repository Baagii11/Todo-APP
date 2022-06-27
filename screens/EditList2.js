import { CommonActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image
} from "react-native";
import Colors from "../constants/Colors";
import ColorSelector from "../components/ColorSelector";
import Button from "../components/Button";
import { firestore, auth } from 'firebase';
import firebase from "firebase/app";
import DatePicker from 'react-native-datepicker';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import {
    onSnapshot,
    addDoc,
    removeDoc,
    updateDoc,
} from "../services/collections";

const colorList = [
    "blue",
    "red",
    "gray",
];

export default ({ navigation, route }) => {
    const [title, setTitle] = useState(route.params.title || "");
    const [color, setColor] = useState(route.params.color || Colors.gray);
    const [beginDate, setBeginDate] = useState(route.params.beginDate || "01-01-2022");
    const [endDate, setEndDate] = useState(route.params.endDate || "01-01-2022");
    const [valueName, setValueName] = useState(route.params.valueName);
    const [currentUserName, setCurrentUserName] = useState(route.params.currentUserName);
    const [buttonIcon, setButtonIcon] = useState("");
    const [isValid, setValidity] = useState(true);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(value || null);
    const [items, setItems] = useState([]);
    const [userId, setUserId] = useState([]);
    const [name, setName] = useState("");
    let name2 = "";
    name2 = firebase.auth().currentUser.displayName;

    useEffect(() => {
        if(name2 === currentUserName){
            setName(valueName);
        }else{
            setName(currentUserName);
        }
    }, []);

    return (
        <View style={styles.container}>
            <Image source={require("../assets/paper.jpeg")}
                   style={{position: "absolute"}}/>
            <View>
                <View style={{ flexDirection: "row"}}>
                    {!isValid && (
                        <Text
                            style={{
                                marginLeft: 35,
                                color: Colors.red,
                                fontSize: 12,
                            }}
                        >
                            * Ажлын нэр хоосон байж болохгүй
                        </Text>
                    )}
                </View>
                <TextInput
                    underlineColorAndroid={"transparent"}
                    selectionColor={"transparent"}
                    autoFocus={true}
                    value={title}
                    onChangeText={(text) => {
                        setTitle(text);
                        setValidity(true);
                    }}
                    placeholder={"Шинэ ажил..."}
                    maxLength={30}
                    style={[styles.input, { outline: "none" }]}
                />
                <Text style={styles.label}>Зэрэглэл сонгох</Text>
                <Text style={styles.labelDescription}>*Дууссан ажил бол цэнхэр</Text>
                <Text style={styles.labelDescription}>*Яаралтай ажил бол улаан</Text>
                <Text style={styles.labelDescription}>*Энгийн ажил бол саарал</Text>
                <ColorSelector
                    onSelect={(color) => {
                        setColor(color);
                        if(color === Colors.red){
                            setButtonIcon(require("../assets/alert1.png"));
                        }else if(color === Colors.gray){
                            setButtonIcon(require("../assets/alert2.png"));
                        }else if(color === Colors.blue){
                            setButtonIcon(require("../assets/alert3.png"));
                        }
                        navigation.dispatch(CommonActions.setParams({ color }));
                    }}
                    selectedColor={color}
                    colorOptions={colorList}
                />
                <Text style={{marginTop: 120,
                              textAlign: "center",
                              fontSize: 16,
                              fontFamily: "PTSerif"}}>Эхлэх хугацаа</Text>
                <DatePicker
                        style={styles.datePickerStyle}
                        date={beginDate} //initial date from state
                        mode="date" //The enum of date, datetime and time
                        placeholder="select date"
                        format="DD-MM-YYYY"
                        minDate="01-01-2016"
                        maxDate="01-01-2030"
                        confirmBtnText="Зөвшөөрөх"
                        cancelBtnText="Буцах"
                        customStyles={{
                            dateIcon: {
                            //display: 'none',
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0,
                            },
                            dateInput: {
                            marginLeft: 36,
                            },
                        }}
                        onDateChange={(beginDate) => {
                            setBeginDate(beginDate);
                        }}
                />
                <Text style={{marginTop: 40,
                              textAlign: "center",
                              fontSize: 16,
                              fontFamily: "PTSerif"}}>Дуусах хугацаа</Text>
                <DatePicker
                        style={styles.datePickerStyle}
                        date={endDate} //initial date from state
                        mode="date" //The enum of date, datetime and time
                        placeholder="select date"
                        format="DD-MM-YYYY"
                        minDate="01-01-2016"
                        maxDate="01-01-2030"
                        confirmBtnText="Зөвшөөрөх"
                        cancelBtnText="Буцах"
                        customStyles={{
                            dateIcon: {
                            //display: 'none',
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0,
                            },
                            dateInput: {
                            marginLeft: 36,
                            },
                        }}
                        onDateChange={(endDate) => {
                            setEndDate(endDate);
                        }}
                />
                <View style={styles.dropdown}>
                    <Ionicons style={{marginBottom: 20}} name="people-outline" size={35}/>
                    <Text style={{ fontFamily: "Cormorant", fontSize: 25}}>{"'" + name + "'"}</Text>
                </View>                                      
            </View>
            <Button
                text="Хадгалах"
                buttonStyle={styles.saveButton}
                onPress={() => {
                    if (title.length > 1) {
                        route.params.saveChanges({ value,title, color, beginDate, endDate, buttonIcon});
                        navigation.dispatch(CommonActions.goBack());
                    } else {
                        setValidity(false);
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        padding: 5,
    },
    datePickerStyle: {
        marginLeft: 100,
        width: 200,
        marginTop: 20,
      },
    input: {
        color: Colors.darkGray,
        marginLeft: 30,
        borderBottomColor: Colors.lightGray,
        borderBottomWidth: 0.5,
        marginHorizontal: 5,
        padding: 3,
        height: 30,
        fontSize: 20,
        fontFamily: "Cormorant",
        marginTop: 30
    },
    saveButton: {
        borderRadius: 25,
        backgroundColor: Colors.darkGray,
        height: 48,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Roman", 
        marginTop: 60
    },
    label: {
        textAlign: "center",
        color: "#000",
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 8,
        marginTop: 60,
        fontFamily: "PTSerif",
        },
    labelDescription: {
        color: Colors.blueGray,
        marginLeft: 123,
        fontFamily: "Cormorant",
        fontSize: 15
        },
    dropdown: {
        marginTop: 40,
        alignItems: "center"
    }
});

