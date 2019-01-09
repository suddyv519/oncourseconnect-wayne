import React, {Component} from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput
} from 'react-native';
import {WebBrowser} from 'expo';
import TabBarIcon from "../TabBarIcon";
import {
    Icon,
    Button
} from "native-base";

class DetailedGrades extends Component {

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            courseId: navigation.getParam('courseId', 'none'),
            courseName: navigation.getParam('courseName', 'Grades'),
            periodId: navigation.getParam('periodId', 'none'),
            username: navigation.getParam('username', 'none'),
            markingPeriod: '',
            categories: [],
            average: '',
            letter: '',
            finishedLoading: false
        };
        this.getGrades(1);
    }

    static navigationOptions = {
        title: 'View Grades',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="checkbox" style={{color: tintColor}}/>
        )
    };



    getGrades = (mp) => {
        console.log("Getting grades...");
        let periodId = parseInt(this.state.periodId) + mp - 1;
        let url = `https://www.oncourseconnect.com/api/classroom/student/get_student_progress_report?classId=${this.state.courseId}&periodId=${periodId}&studentId=${this.state.username}`;
        fetch(url, {
            credentials: 'include'
        }).then((response) => {
            response.json().then( data => {
                data = data.ReturnValue;
                this.setState({
                    average: data.calculated_grade,
                    letter: data.calculated_grade_scale,
                    markingPeriod: data.term_name
                });
                let formattedCategories = [];
                let categories = data.categories;
                categories.forEach(category => {
                    console.log('true');
                    let assignments = category.category_assignments;
                    let formattedAssignments = [];
                    assignments.forEach((assignment, index, assignments) => {
                        if (index < assignments.length - 1) {
                            formattedAssignments.push({
                                name: assignment.assignment_name,
                                point_grade: assignment.print_grade,        // 80/100
                                percent_grade: assignment.numerical_score   // 80%
                            });
                        }
                    });
                    let formattedCategory = {
                        name: category.category_name,
                        assignments: formattedAssignments,
                    };
                    formattedCategories.push(formattedCategory);
                });
                this.setState({categories: formattedCategories})
            }).catch( error => console.error(error));
        }).then(() => {
            this.setState({finishedLoading: true});
            console.log('Done');
        }).catch(error => {console.error(error);
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.state.courseName}</Text>
                {this.state.finishedLoading ?
                    <Button onPress={() => console.log(this.state)}>
                        <Text>State</Text>
                    </Button>
                :
                    <Text>Loading grades...</Text>
                }
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


