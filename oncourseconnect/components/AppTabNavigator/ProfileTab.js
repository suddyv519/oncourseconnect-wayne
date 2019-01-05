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
        console.log("Attempting to sign in...");
        console.log(this.state);
        let url = `https://www.oncourseconnect.com/sso/login?id=wayne&userType=S&username=${this.state.username}&password=${this.state.password}`;

        fetch(url, {
            method: 'POST',
            credentials: 'include',
        }).then((response) => {
            if (response.url === 'https://www.oncourseconnect.com/') {
                this.setState({signedIn: !this.state.signedIn});
                console.log("Sign in successful");
            } else {
                // console.log(response.text());
                console.log("Sign in failed");
                Alert.alert('Sign in failed', 'Incorrect username/password', [{text: 'OK'}]);
            }
        }).catch((error) => {
            console.error(error);
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
                signedIn: !this.state.signedIn
            });
            console.log("Sign out successful")
        }).catch((error) => {
            console.error(error);
        });
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


