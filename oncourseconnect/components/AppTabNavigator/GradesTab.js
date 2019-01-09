import React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
} from 'react-native';
import {
    Header,
    Icon,
    ListItem,
    Text,
    Left,
    Right,
    Container,
    Content,
    View,
    Body,
    Title
} from 'native-base'

import store from 'react-native-simple-store';

import {WebBrowser} from 'expo';
import DetailedGrades from "../DetailedGrades/DetailedGrades";

class GradesTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            schoolId: '',
            courses: [],
            periodId: '',
            yearId: '',
            signedIn: false,
            finishedLoading: false
        };
        this.loadInfo();
    }

    loadInfo = () => {
        store.get('signedIn')
            .then((signedIn) => this.setState({signedIn: signedIn}))
            .then(() => store.get('username'))
            .then(username => this.setState({username: username}))
            .then(() => store.get('schoolId'))
            .then(schoolId => this.setState({schoolId: schoolId}))
            .then(() => store.get('periodId'))
            .then(periodId => this.setState({periodId: periodId}))
            .then(() => store.get('yearId'))
            .then((yearId) => this.setState({yearId: yearId}))
            .then(() => store.get('courses'))
            .then(courses => this.setState({courses: courses}))
            .then(() => this.setState({finishedLoading: true}))
            // .then(() => console.log(this.state))
            .catch(error => console.error(error.message));
    };

    renderListItem = (course) => {
        return (
            <ListItem noIndent
                      onPress={() => {
                          this.props.navigation.navigate('Grades', {
                              courseId: course.id,
                              courseName: course.name,
                              username: this.state.username,
                              periodId: this.state.periodId
                          });
                      }}
            >
                <Left>
                    {course.teacher !== 'None' ?
                        <Text style={styles.listItem} >{course.name} - {course.teacher}</Text>
                    :
                        <Text style={styles.listItem} >{course.name}</Text>
                    }
                </Left>
                <Right>
                    <Icon name='arrow-forward'/>
                </Right>
            </ListItem>
        );
    };


    render() {
        store.get('signedIn').then((signedIn) => this.setState({signedIn: signedIn}));
        // TODO: look into using Accordion with custom rendering to expand MP 1-4
        return (
            <Container>
                <View style={styles.container}>

                    {/*<Header>*/}
                        {/*<Body>*/}
                            {/*<Title>Grades</Title>*/}
                        {/*</Body>*/}
                    {/*</Header>*/}
                    {!this.state.signedIn &&
                        <Text>Please Sign In</Text>
                    }
                    {this.state.signedIn && this.state.finishedLoading &&
                        <FlatList
                            data={this.state.courses}
                            renderItem={({item}) => this.renderListItem(item)}
                            keyExtractor={(item) => item.id}
                        />
                    }
                    {!this.state.finishedLoading &&
                        <Text>Loading...</Text>
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


