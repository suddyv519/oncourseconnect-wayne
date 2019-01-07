import React, { Component } from 'react';
import {Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Icon} from "native-base";
import {AppLoading, Asset, Font} from 'expo';
import {createStackNavigator, createAppContainer, createBottomTabNavigator} from 'react-navigation';

import MainScreen from "./components/MainScreen";
import GradesTab from "./components/AppTabNavigator/GradesTab";
import HomeworkTab from "./components/AppTabNavigator/HomeworkTab";
import AttendanceTab from "./components/AppTabNavigator/AttendanceTab";
import ScheduleTab from "./components/AppTabNavigator/ScheduleTab";
import ProfileTab from "./components/AppTabNavigator/ProfileTab";
import DetailedGrades from "./components/DetailedGrades/DetailedGrades";


class App extends Component {
    state = {
        isLoadingComplete: false,
    };

    static navigationOptions = {
        title: 'OnCourse Connect'
    };

    render() {
        return (
            <AppContainer />
        );
    }

    _handleLoadingError = error => {
        // In this case, you might want to report the error to your error
        // reporting service, for example Sentry
        console.warn(error);
    };

    _handleFinishLoading = () => {
        this.setState({isLoadingComplete: true});
    };
}

// const AppStackNavigator = createStackNavigator({
//     Main: {
//         screen: MainScreen
//     }
// });

const GradesStack = createStackNavigator({
    Classes: GradesTab,
    Grades: DetailedGrades
});

GradesStack.navigationOptions = {
    // TODO: figure out Grades header
    title: 'Grades',
    tabBarIcon: ({ tintColor }) => (
        <Icon name="school" style={{color: tintColor}}/>
    )
};

const AppTabNavigator = createBottomTabNavigator({
    GradesTab: {
        screen: GradesStack
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

const AppContainer = createAppContainer(AppTabNavigator);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
    },
    contentContainer: {
        paddingTop: 30,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
    },
    codeHighlightContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
    },
    labelText: {
        fontSize: 24,
        textAlign: 'left',
    },
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: {height: -3},
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
    },
    tabBarInfoText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center',
    },
    navigationFilename: {
        marginTop: 5,
    },
    helpContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
});

export default App;