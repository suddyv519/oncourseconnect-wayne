import React, {Component} from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput
} from 'react-native';
import {WebBrowser} from 'expo';
import TabBarIcon from "../TabBarIcon";
import {
    Icon,
    View,
    Text,
    Container,
    Button
} from "native-base";

import store from 'react-native-simple-store';

class AttendanceTab extends Component {

    constructor(props) {
        super(props);
        const {navigation} = this.props;
        this.state = {
            username: '',
            schoolId: '',
            yearId: '',
            schoolYear: '',
            daysAbsent: 0,
            daysPresent: 0,
            daysTardy: 0,
            signedIn: false,
            finishedLoading: false
        };
        this.loadState();
    }

    static navigationOptions = {
        title: 'Attendance',
        tabBarIcon: ({tintColor}) => (
            <Icon name="checkbox" style={{color: tintColor}}/>
        )
    };

    loadState = () => {
        console.log('Getting store data...');
        store.get('signedIn')
            .then((signedIn) => this.setState({signedIn: signedIn}))
            .then(() => store.get('username'))
            .then(username => this.setState({username: username}))
            .then(() => store.get('schoolId'))
            .then(schoolId => this.setState({schoolId: schoolId}))
            .then(() => store.get('yearId'))
            .then((yearId) => this.setState({yearId: yearId}))
            .then(() => this.getAttendance())
            .then(() => console.log('Done'))
            .catch(error => console.error(error.message));
    };

    getAttendance = () => {
        console.log('Getting attendance data...');
        let url = `https://www.oncourseconnect.com/api/classroom/student/attendance_summary?schoolID=${this.state.schoolId}&schoolYearID=${this.state.yearId}&studentID=${this.state.username}`;
        fetch(url, {
            method: 'POST',
            credentials: 'include'
        }).then(response => {
            response.json().then(attendanceData => {
                attendanceData = attendanceData.ReturnValue.overall;
                console.log(attendanceData);
                this.setState({
                    schoolYear: attendanceData.school_year,
                    daysAbsent: parseInt(attendanceData.Absent),
                    daysPresent: parseInt(attendanceData.Present),
                    daysTardy: parseInt(attendanceData.Tardy)
                });
            });
        })
        .then(() => {
            this.setState({finishedLoading: true});
            console.log('Done');
        }).catch(error => console.error(error));
    };

    render() {
        return (
            <Container>
                <View style={styles.container}>
                    <Text>{this.state.courseName}</Text>
                    {this.state.finishedLoading ?
                        <Button onPress={() => console.log(this.state)}>
                            <Text>State</Text>
                        </Button>
                        :
                        <Text>Loading attendance...</Text>
                    }
                </View>
            </Container>
        );
    }

}

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

export default AttendanceTab;


