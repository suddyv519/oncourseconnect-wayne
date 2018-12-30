import React, {Component} from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    TextInput
} from 'react-native';
import {WebBrowser} from 'expo';
import {createBottomTabNavigator, createAppContainer} from "react-navigation";
import GradesTab from "./AppTabNavigator/GradesTab";
import AttendanceTab from "./AppTabNavigator/AttendanceTab";
import ScheduleTab from "./AppTabNavigator/ScheduleTab";
import HomeworkTab from "./AppTabNavigator/HomeworkTab";
import ProfileTab from "./AppTabNavigator/ProfileTab";
import TabBarIcon from "./TabBarIcon";

class MainScreen extends Component {

    static navigationOptions = {
        title: 'OnCourse Connect'
    };

    render() {
        return (
            <TabContainer />
        );
    }
}

export default MainScreen;

const AppTabNavigator = createBottomTabNavigator({
    GradesTab: {
        screen: GradesTab
    },
    HomeworkTab: {
        screen: HomeworkTab
    },
    AttendanceTab: {
        screen: AttendanceTab
    },
    ScheduleTab: {
        screen: ScheduleTab
    },
    ProfileTab: {
        screen: ProfileTab
    }
});

const TabContainer = createAppContainer(AppTabNavigator);

