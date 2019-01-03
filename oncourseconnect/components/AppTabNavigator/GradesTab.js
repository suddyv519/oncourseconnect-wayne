import React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Button,
    TextInput,
    FlatList,
} from 'react-native';
import {
    Header,
    Icon,
    View,
    ListItem,
    Left,
    Right,
    Container,
    Body,
    Title
} from 'native-base';
import {WebBrowser} from 'expo';
import DetailedGrades from "../DetailedGrades/DetailedGrades";

class GradesTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '12248459',
            schoolId: '',
            courses: [],
            periodId: '',
            yearId: '',
            loggedIn: true,
            finishedLoading: false
        };
        this.getSchoolInfo();
    }

    getSchoolInfo = () => {
        if (!this.state.loggedIn) {
            return;
        }
        console.log("Getting school and year id info...");
        let url = `https://www.oncourseconnect.com/api/classroom/student/get_student_school_years?studentId=${this.state.username}`;
        fetch(url, {
            credentials: 'include'
        }).then((response) => {
            // console.log(response);
            // console.log(response.url)
            response.json().then( data => {
                let info = data[0];
                this.setState({
                    schoolId: info.school_id,
                    yearId: info.gb_school_year_id
                });
            }).then(() => this.getClassInfo());
        }).catch((error) => {
            console.error(error);
        });
    };

    getClassInfo = () => {
        console.log("Getting class and period id info...");
        let url = `https://www.oncourseconnect.com/api/classroom/student/report_cards?schoolId=${this.state.schoolId}&schoolYearId=${this.state.yearId}&studentId=${this.state.username}`;
        fetch(url, {
            credentials: 'include'
        }).then((response) => {
            response.json().then( data => {
                // console.log(data.report_cards[0].rows);
                let courseInfo = data.report_cards[0].rows;
                courseInfo.forEach( course => {
                    let teacher = course[0].classStaff.length ? course[0].classStaff[0].staff_name : 'None';
                    let courseObj = {
                        name: course[0].class,
                        teacher: teacher,
                        id: course[1].gb_class_id
                    };
                    // console.log(courseObj);
                    let currentCourses = this.state.courses;
                    currentCourses.push(courseObj);
                    this.setState({courses: currentCourses});
                    if (this.state.periodId === '') {
                        this.setState({periodId: course[1].period_id});
                    }
                });
            }).catch( error => console.error(error));
        }).then(() => {
            this.setState({finishedLoading: true});
            console.log('Done');
        }).catch((error) => {
            console.error(error);
        });
    };

    getGrades = (classId) => {
        console.log("getting grades...");
        let url = `https://www.oncourseconnect.com/api/classroom/student/get_student_progress_report?classId=${classId}&periodId=${this.state.periodId}&studentId=${this.state.username}`;
        fetch(url, {
            credentials: 'include'
        }).then((response) => {
            response.json().then( data => {
                console.log(data);
            }).catch( error => console.error(error));
        }).catch((error) => {
            console.error(error);
        });
    };

    renderListItem = (course) => {
        return (
            <ListItem noIndent>
                <Left>
                    <Text style={styles.listItem} onPress={() => this.getGrades(course.id)} >{course.name} - {course.teacher}</Text>
                </Left>
                <Right>
                    <Icon name='arrow-forward'/>
                </Right>
            </ListItem>
        );
    };


    render() {
        return (
            <Container>
                <View style={styles.container}>
                    {/*<Header>*/}
                        {/*<Body>*/}
                            {/*<Title>Grades</Title>*/}
                        {/*</Body>*/}
                    {/*</Header>*/}
                    {this.state.finishedLoading ?
                        <FlatList
                            data={this.state.courses}
                            renderItem={({item}) => this.renderListItem(item)}
                            keyExtractor={(item) => item.id}
                        />
                    :
                        <View>
                            <Text>Loading...</Text>
                        </View>
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
    listItem: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 5
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

export default GradesTab;


