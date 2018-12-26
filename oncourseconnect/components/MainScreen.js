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

import {MonoText} from './StyledText';

class MainScreen extends Component {
    static navigationOptions = {
        header: On,
    };

    state = {
        username: '',
        password: '',
        schoolIds: [],
        courseIds: [],
        yearIds: [],
        loggedIn: false
    };

    login = () => {
        console.log("attempting login...");

        let url = `https://www.oncourseconnect.com/sso/login?id=wayne&userType=S&username=${this.state.username}&password=${this.state.password}`;

        fetch(url, {
            method: 'POST',
            credentials: 'include',
        })
        .then((res) => {
            let response = res.text();
            console.log(response);
            //console.log(response.indexOf('incorrect') === -1 ? "login success" : "login failed"); // return true if login successful
            this.setState({loggedIn: true});
        })
        .catch((error) => {
            console.error(error);
        });
    };

    logout = () => {
        console.log("attempting to log out...");
        let url = 'https://www.oncourseconnect.com/account/logout';
        fetch(url, {
            credentials: 'include'
        })
        .then((response) => {
            console.log(response);
            this.setState({loggedIn: false});
        })
        .catch((error) => {
            console.error(error);
        });
    };

    getInfo = () => {
        console.log("getting school and year id info...");
        let url = `https://www.oncourseconnect.com/api/classroom/student/get_student_school_years?studentId=${this.state.username}`;
        fetch(url, {
            credentials: 'include'
        })
        .then((response) => {
            console.log(response.body);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    getGrades = (classId, schoolId, yearId) => {
        // TODO: change this so it only gets grades for a specific class
        console.log("getting grades...");
        let url = `https://www.oncourseconnect.com/api/classroom/student/report_cards?schoolId=${schoolId}&schoolYearId=${yearId}&studentId=${this.state.username}`;
        fetch(url, {
            credentials: 'include'
        })
        .then((response) => {
                console.log(response.body);
            })
        .catch((error) => {
            console.error(error);
        });
    };


    render() {
        return (
            <View style={styles.container}>
                {!this.state.loggedIn ?
                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                        <Text style={styles.labelText}>Username</Text>
                        <TextInput
                            placeholder="Enter username"
                            onChangeText={(text) => this.setState({username: text})}
                        />
                        <Text style={styles.labelText}>Password</Text>
                        <TextInput
                            placeholder="Enter password"
                            onChangeText={(text) => this.setState({password: text})}
                        />
                        <Button style={styles.button} onPress={this.login} title='Login'/>

                        <Button style={{padding:'10'}} title={'Get Grades'} onPress={this.getGrades}/>
                    </ScrollView>
                :
                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                        <Button style={{padding:'10'}} title={'Get Grades'} onPress={this.getGrades}/>
                        <Button style={styles.button} onPress={this.logout} title='Logout'/>
                    </ScrollView>
                }

                <View style={styles.tabBarInfoContainer}>
                    <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

                    <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
                        <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
                    </View>
                </View>
            </View>
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

export default MainScreen;