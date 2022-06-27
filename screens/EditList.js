import { CommonActions } from "@react-navigation/native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
} from "react-native";
import Colors from "../constants/Colors";
import ColorSelector from "../components/ColorSelector";
import Button from "../components/Button";
import DatePicker from 'react-native-datepicker';
import { firestore, auth } from 'firebase';
import firebase from "firebase/app";
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import {
    onSnapshot,
    addDoc,
    removeDoc,
    updateDoc,
} from "../services/collections";

const colorList = [
    "red",
    "gray",
];

export default ({ navigation, route }) => {

    const [title, setTitle] = useState(route.params.title || "");
    const [color, setColor] = useState(route.params.color || Colors.gray);
    const [beginDate, setBeginDate] = useState(route.params.beginDate || "01-01-2022");
    const [endDate, setEndDate] = useState(route.params.endDate || "01-01-2022");
    const [buttonIcon, setButtonIcon] = useState("");
    const [isValid, setValidity] = useState(true);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    let valueId = "";
    let valueName = "";
    let currentUserName = firebase.auth().currentUser.displayName;
    const names = ["Буянжаргал", "Нандин-эрдэнэ", "Энхбаясгалан", "Мишээл", "Билгүүн", "Гантуяа", "Батэрдэнэ"];

    useEffect(() => {
        const listsRef = firestore().collection("users");
        onSnapshot(
            listsRef,
            (newLists) => {
                for(let i=0; i < newLists.length; i++){
                    items.push({label: names[i], value: {id: newLists[i].id, name: names[i]}})
                }
            }
        );
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
                                position: "absolute",
                                marginLeft: 190,
                                marginTop: 40,
                                color: Colors.red,
                                fontSize: 12,
                                fontFamily: "PTSerif"
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
                            setButtonIcon(require("../assets/alert2.png"));
                        }
                        navigation.dispatch(CommonActions.setParams({ color }));
                    }}
                    selectedColor={color}
                    colorOptions={colorList}
                />
                <Text style={{marginTop: 90,
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
                              fontFamily: "PTSerif",}}>Дуусах хугацаа</Text>
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
                    <Ionicons style={{marginBottom: 20, marginLeft: 190}} name="person-add" size={30}/>
                    <View style={{alignItems: "flex-start", flexDirection: "row"}}>
                    {/* <Text style={{marginRight: 10, color: "#fff", backgroundColor: Colors.red, marginBottom: 10}}>{value}</Text> */}
                </View>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        placeholder="Хамтрагч нэмэх"
                        placeholderStyle={{color: "gray"}}
                        />
                </View>                   
            </View>
            <Button
                text="Хадгалах"
                buttonStyle={styles.saveButton}
                onPress={() => {
                    // alert(value.name);
                    try {
                        valueId = value.id;
                        valueName = value.name;
                    } catch (error) {
                        
                    }
                    if (title.length > 1) {
                        route.params.saveChanges({ valueId, valueName, currentUserName, title, color, beginDate, endDate, buttonIcon});
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
        marginTop: 90
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
    }
});
