import React, {useState, useEffect, useLayoutEffect} from "react";
import { View, Image , Text, TouchableOpacity, FlatList, StyleSheet} from "react-native";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import {
    onSnapshot,
    addDoc,
    removeDoc,
    updateDoc,
} from "../services/collections";
import { firestore, auth } from "firebase";
import { color } from "react-native-reanimated";

const ListButton = ({ title, color, onPress, onDelete, onOptions ,endDate, beginDate, buttonIcon}) => {
    return (
        <TouchableOpacity
            style={[styles.itemContainer, { backgroundColor: color }]}
            onPress={onPress}>
            <View>
                <Image source={buttonIcon} style={{height: 40, width: 40}}/>
            </View>
            <View>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text>Эхлэх хугацаа: {beginDate}</Text>
                <Text>Дуусах хугацаа: {endDate}</Text>
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

export default ({ navigation }) => {
    const [lists, setLists] = useState([]);
    const listsRef = firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .collection("lists");
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

    const addItemToLists = ({ title, color, beginDate, endDate, buttonIcon}) => {
        let index;
        if(color === Colors.red){
            index = 0;
        }else{
            index = 1;
        }

        // for(let i=0; i > lists.length; i++){
        //     if(lists[i].color === Colors.red){
        //       lenghtRed++;   
        //     };
        // };
        // alert(lenghtRed);
        // index = (lenghtRed >= 1) ? lists[lenghtRed].index + 1 : 0;
        addDoc(listsRef, { title, color, index , beginDate, endDate, buttonIcon});
    };

    const removeItemFromLists = (id) => {
        removeDoc(listsRef, id);
    };

    const updateItemFromLists = (id, item) => {
        updateDoc(listsRef, id, item);
    };

    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => renderAddListIcon(navigation, addItemToLists),
    //     });
    // });
    
    return (
        <View style={{ flex: 1, color: "white" }}>
            <Image source={require("../assets/report.webp")}
                   style={{position: "absolute"}}/>
        <FlatList
                data={lists}
                renderItem={({ item: { title, color, id, index , endDate, beginDate, buttonIcon} }) => {
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
                                })
                            }}
                            onOptions={() => {
                                navigation.navigate("Edit", {
                                    title,
                                    color,
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
    itemTitle: { fontSize: 24, padding: 5, color: "white" },
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

