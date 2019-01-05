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
import TabBarIcon from "../TabBarIcon";
import {Icon} from "native-base";

class DetailedGrades extends Component {

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            courseId: navigation.getParam('courseId', 'none'),
            courseName: navigation.getParam('courseName', 'Grades'),
            periodId: navigation.getParam('periodId', 'none'),
            username: navigation.getParam('username', 'none')
        };
        console.log(this.state);
    }

    static navigationOptions = {
        title: 'View Grades',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="checkbox" style={{color: tintColor}}/>
        )
    };

    getGrades = (mp) => {
        console.log("getting grades...");
        let periodId = parseInt(this.state.periodId) + mp - 1;
        let url = `https://www.oncourseconnect.com/api/classroom/student/get_student_progress_report?classId=${this.state.courseId}&periodId=${periodId}&studentId=${this.state.username}`;
        fetch(url, {
            credentials: 'include'
        }).then((response) => {
            response.json().then( data => {
                console.log(data);
                return data.toString();
            }).catch( error => console.error(error));
        }).catch((error) => {
            console.error(error);
        });
    };

    render() {
        this.getGrades(2);
        return (
            <View style={styles.container}>
                <Text>{this.state.courseName}</Text>
            </View>
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

export default DetailedGrades;


