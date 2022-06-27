import React, { useLayoutEffect, useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import {
    onSnapshot,
    addDoc,
    removeDoc,
    updateDoc,
} from "../services/collections";
import { firestore, auth } from "firebase";

const ListButton = ({ title, color, onPress, onDelete, onOptions ,endDate, beginDate, buttonIcon}) => {

    return (
        <TouchableOpacity
            style={[styles.itemContainer, { backgroundColor: color }]}
            onPress={onPress}>
            <View>
                {/* <Ionicons name={buttonIcon} size={30}/> */}
                <Image source={buttonIcon} style={{height: 40, width: 40}}/>
            </View>
            <View>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text style={{color: "#fff", fontFamily: "Cormorant", fontSize: 18}}>Эхлэх хугацаа: {beginDate}</Text>
                <Text style={{color: "#fff", fontFamily: "Cormorant", fontSize: 18}}>Дуусах хугацаа: {endDate}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={onOptions}>
                    <Ionicons name="options-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete}>
                    <Ionicons name="trash-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const renderAddListIcon = (navigation, addItemToLists) => {
 
    return (
        <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
                style={{ justifyContent: "center", marginRight: 12 }}
                onPress={() => navigation.navigate("Тохиргоо")}
            >
                <Ionicons name="settings" size={16} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("Edit", { saveChanges: addItemToLists })
                }
                style={{ justifyContent: "center", marginRight: 12, marginBottom: 4}}
            >
                <Text style={styles.icon}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("Тайлан", { saveChanges: addItemToLists })
                }
                style={{ justifyContent: "center", marginRight: 14 }}
            >
                <Ionicons name="document-text" size={16} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("Календарь", { saveChanges: addItemToLists })
                }
                style={{ justifyContent: "center", marginRight: 8 }}
            >
                <Ionicons name="calendar" size={16} />
            </TouchableOpacity>
        </View>
    );
};

export default ({ navigation }) => {
    const [lists, setLists] = useState([]);
    const listsRef = firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .collection("lists");
    
    // const listsRef = firestore()
    //     .collection("users")
    //     .doc(auth().currentUser.uid)
    //     .collection("lists");

    useEffect(() => {
        onSnapshot(
            listsRef,
            (newLists) => {
                setLists(newLists);
            },
            {
                sort: (a, b) => {
                    if (a.index < b.index) {
                        return -1;
                    }

                    if (a.index > b.index) {
                        return 1;
                    }

                    return 0;
                },
            }
        );
    }, []);

    const addItemToLists = ({ valueId, valueName, currentUserName, title, color, beginDate, endDate, buttonIcon}) => {
        var flag = true;
        if(valueId !== ""){
            var listsRef2 = firestore()
                .collection("users")
                .doc(valueId)
                .collection("lists");
        }else{
            flag = false;
        }
        let index;
        if(color === Colors.red){
            index = 0;
        }else if(color === Colors.gray){
            index = 1;
        }else{
            index = 2;
        }

        // for(let i=0; i > lists.length; i++){
        //     if(lists[i].color === Colors.red){
        //       lenghtRed++;   
        //     };
        // };
        // alert(lenghtRed);
        // index = (lenghtRed >= 1) ? lists[lenghtRed].index + 1 : 0;
        addDoc(listsRef, {valueId, valueName, currentUserName, title, color, index , beginDate, endDate, buttonIcon});
        if(flag){
            addDoc(listsRef2, {valueId ,valueName, currentUserName, title, color, index , beginDate, endDate, buttonIcon});
        }
    };

    const removeItemFromLists = (id) => {
        removeDoc(listsRef, id);
    };

    const updateItemFromLists = (id, item) => {
        updateDoc(listsRef, id, item);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => renderAddListIcon(navigation, addItemToLists),
        });
    });

    return (
        <View style={styles.container}>
            <Image source={require("../assets/image2.png")}
                   style={{position: "absolute"}}/>
            <FlatList
                data={lists}
                renderItem={({ item: {valueId, currentUserName ,valueName, title, color, id, index, endDate, beginDate, buttonIcon} }) => {
                    return (
                        <ListButton
                            buttonIcon={buttonIcon}
                            title={title}
                            color={color}
                            endDate={endDate}
                            beginDate={beginDate}
                            navigation={navigation}
                            onPress={() => {
                                navigation.navigate("ToDoList", {
                                    title,
                                    color,
                                    listId: id,
                                    valueId,
                                })
                            }}
                            onOptions={() => {
                                navigation.navigate("Edit2", {
                                    title,
                                    color,
                                    beginDate,
                                    endDate,
                                    valueName,
                                    currentUserName,
                                    saveChanges: (newItem) =>
                                        updateItemFromLists(id, {
                                            index,
                                            ...newItem,
                                        }),
                                });
                            }}
                            onDelete={() => removeItemFromLists(id)}
                        />
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    itemTitle: { fontSize: 24, padding: 5, color: "white", fontFamily: "PTSerif"},
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 100,
        flex: 1,
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 15,
    },
    icon: {
        padding: 5,
        fontSize: 24,
    },
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
