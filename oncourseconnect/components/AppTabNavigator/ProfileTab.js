import React, {Component} from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    TextInput,
    Alert
} from 'react-native';
import {WebBrowser} from 'expo';
import {
    Icon,
    Button,
    Body,
    Title,
    Container,
    Header,
    Content,
    Text,
    Form,
    Item,
    Input,
} from "native-base";

import store from 'react-native-simple-store';

class ProfileTab extends Component {

    static navigationOptions = {
        title: 'Profile',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="person" style={{color: tintColor}}/>
        )
    };

    state = {
        username: '',
        password: '',
        schoolId: '',
        yearId: '',
        signedIn: false
    };

    login = () => {
        if (this.state.username === '') {
            Alert.alert('Error', 'Username cannot be blank', [{text: 'OK'}]);
            return;
        } else if (this.state.password === '') {
            Alert.alert('Error', 'Password cannot be blank', [{text: 'OK'}]);
            return;
        }
        this.clearStorage();
        console.log("Attempting to sign in...");
        let url = `https://www.oncourseconnect.com/sso/login?id=wayne&userType=S&username=${this.state.username}&password=${this.state.password}`;

        // TODO: save auth cookie in storage and add to all request headers
        fetch(url, {
            method: 'POST',
            credentials: 'include',
        }).then((response) => {
            if (response.url === 'https://www.oncourseconnect.com/') {
                this.setState({signedIn: true});
                store.push('users', this.state.username)
                    .then(() => store.save('username', this.state.username))
                    .then(username => {
                        store.get('users').then(users => {
                            if (!users.includes(username)) {
                                this.getSchoolInfo();
                            }
                        });
                    })
                    .then(() => store.save('signedIn', true)
                    .then(() => console.log("Sign in successful")))
                    .catch(error => console.error(error.message));
            } else {
                console.log(`Sign in failed: ${response.url}`);
                Alert.alert('Sign in failed', 'Incorrect username/password', [{text: 'OK'}]);
            }
        }).catch((error) => {
            console.error(error.message);
        });
    };

    logout = () => {
        console.log("Attempting to sign out...");
        let url = 'https://www.oncourseconnect.com/account/logout';
        fetch(url, {
            credentials: 'include'
        }).then(() => {
            this.setState({
                username: '',
                password: '',
                schoolId: '',
                yearId: '',
                signedIn: false
            });
            this.clearStorage();
            store.save('signedIn', false).then(() => console.log("Sign out successful"));
        }).catch((error) => {
            console.error(error.message);
        });
    };

    getSchoolInfo = () => {
        if (!this.state.signedIn) {
            return;
        }
        console.log("Getting school and year id info...");
        let url = `https://www.oncourseconnect.com/api/classroom/student/get_student_school_years?studentId=${this.state.username}`;
        fetch(url, {
            credentials: 'include'
        }).then((response) => {
            // console.log(response);
            response.json().then(data => {
                let info = data[0];
                store.save('schoolId', info.school_id)
                    .then(() => store.save('yearId', info.gb_school_year_id))
                    .then(() => {
                        this.setState({schoolId: info.school_id});
                        this.setState({yearId: info.gb_school_year_id});
                    })
                    .then(() => this.getClassInfo())
                    .catch(error => console.error(error.message))
            });
        }).catch((error) => {
            console.error(error.message);
        });
    };

    getClassInfo = () => {
        console.log("Getting class and period id info...");
        let url = `https://www.oncourseconnect.com/api/classroom/student/report_cards?schoolId=${this.state.schoolId}&schoolYearId=${this.state.yearId}&studentId=${this.state.username}`;
        console.log(url);
        fetch(url, {
            credentials: 'include'
        }).then((response) => {
            // console.log(response);
            let courseArr = [];
            response.json()
                .then(data => {
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
                    courseArr.push(courseObj);
                    store.save('periodId', course[1].period_id).catch(error => console.error(error));
                });
                })
                .then(() => store.save('courses', courseArr))
                .catch( error => console.error(error));
        }).then(() => {
            console.log('Done');
        }).catch((error) => {
            console.error(error.message);
        });
    };

    clearStorage = () => {
        console.log("Clearing storage...");
        store.delete('users')
            .then(() => store.delete('username'))
            .then(() => store.delete('schoolId'))
            .then(() => store.delete('yearId'))
            .then(() => store.delete('periodId'))
            .then(() => store.delete('courses'))
            .catch(error => console.error(error.message));
    };

    render() {
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>Profile</Title>
                    </Body>
                </Header>
                <Content>
                    {!this.state.signedIn ?
                        <Form>
                            <Item>
                                <Input placeholder="Username" name="username" onChangeText={(username) => this.setState({username: username})}/>
                            </Item>
                            <Item>
                                <Input placeholder="Password" name="password" secureTextEntry={true} onChangeText={(password) => this.setState({password: password})}/>
                            </Item>
                            <Button primary onPress={this.login}>
                                <Text>Sign In</Text>
                            </Button>
                        </Form>
                    :
                        <Form>
                            <Button primary onPress={this.logout}>
                                <Text>Sign Out</Text>
                            </Button>
                        </Form>
                    }
                </Content>
            </Container>
        );
    }

    _maybeRenderDevelopmentModeWarning() {
        if (__DEV__) {
            const learnMoreButton = (
                <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
                    Learn more
                </Text>
            );

            return (
                <Text style={styles.developmentModeText}>
                    Development mode is enabled, your app will be slower but you can use useful development
                    tools. {learnMoreButton}
                </Text>
            );
        } else {
            return (
                <Text style={styles.developmentModeText}>
                    You are not in development mode, your app will run at full speed.
                </Text>
            );
        }
    }

    _handleLearnMorePress = () => {
        WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
    };

    _handleHelpPress = () => {
        WebBrowser.openBrowserAsync(
            'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
        );
    };
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

export default ProfileTab;


