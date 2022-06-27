import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/Home";
import ToDoList from "./screens/ToDoList";
import EditList from "./screens/EditList";
import EditList2 from "./screens/EditList2";
import Login from "./screens/Login";
import Settings from "./screens/Settings";
import Report from "./screens/Report";
import CalendarView from "./screens/CalendarView";
import Colors from "./constants/Colors";
import firebase from "firebase/app";
import "firebase/firestore";
import { useFonts } from 'expo-font';

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

const AuthScreens = () => {
    const [loaded] = useFonts({
        IndieFlower: require('./assets/fonts/IndieFlower-Regular.ttf'),
        Florsn: require("./assets/fonts/Florsn41.ttf"),
        Roman: require("./assets/fonts/ATClassicRoman.ttf"),
        ExpoRegular: require("./assets/fonts/Expo-Regular.ttf"),
        Rubik: require("./assets/fonts/Rubik-VariableFont_wght.ttf"),
        Cormorant: require("./assets/fonts/Cormorant-Medium.ttf"),
        PTSerif: require("./assets/fonts/PTSerif-Regular.ttf"),
        Azery: require("./assets/fonts/AZERY.ttf"),
        Inter: require("./assets/fonts/Inter-SemiBoldItalic.otf"),
      });

      if (!loaded) {
        return null;
      }
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name="Нэвтрэх цонх" component={Login}/>
        </AuthStack.Navigator>
    );
};
const Screens = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Нүүр хуудас" component={Home} />
            <Stack.Screen name="Тохиргоо" component={Settings} />
            <Stack.Screen name="Тайлан " component={Report} />
            <Stack.Screen name="Календарь" component={CalendarView} />
            <Stack.Screen
                name="ToDoList"
                component={ToDoList}
                options={({ route }) => {
                    return {
                        title: route.params.title,
                        headerStyle: {
                            backgroundColor: route.params.color,
                        },
                        headerTintColor: "white",
                    };
                }}
            />
            <Stack.Screen
                name="Edit"
                component={EditList}
                options={({ route }) => {
                    return {
                        title: route.params.title
                            ? `${route.params.title}  ажлыг засах`
                            : "Шинэ ажил үүсгэх",
                        headerStyle: {
                            backgroundColor: route.params.color || Colors.gray,
                        },
                        headerTintColor: "white",
                    };
                }}
            />
            <Stack.Screen
                name="Edit2"
                component={EditList2}
                options={({ route }) => {
                    return {
                        title: route.params.title
                            ? `${route.params.title}  ажлыг засах`
                            : "Шинэ ажил үүсгэх",
                        headerStyle: {
                            backgroundColor: route.params.color || Colors.gray,
                        },
                        headerTintColor: "white",
                    };
                }}
            />
        </Stack.Navigator>
        
    );
};

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        if (firebase.auth().currentUser) {
            setIsAuthenticated(true);
        }
        firebase.auth().onAuthStateChanged((user) => {
            console.log("Checking auth state...");
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        });
    }, []);
    return (
        <NavigationContainer>
            {isAuthenticated ? <Screens /> : <AuthScreens />}
        </NavigationContainer>
    );
}

const firebaseConfig = {
    apiKey: "AIzaSyBv-8_jLZkvyYp3sqB21oAIEYcubuu-v3Y",
    authDomain: "todoapp-3cea1.firebaseapp.com",
    databaseURL: "https://todoapp-3cea1-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "todoapp-3cea1",
    storageBucket: "todoapp-3cea1.appspot.com",
    messagingSenderId: "1074906649398",
    appId: "1:1074906649398:android:de092885ea54c99468d997"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}
