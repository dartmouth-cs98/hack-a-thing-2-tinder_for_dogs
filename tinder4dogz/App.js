import React from 'react';
import {
    Animated, Dimensions, Image, Modal, PanResponder, StyleSheet, Text, TouchableWithoutFeedback, View,
} from 'react-native';
import { Header, Icon } from 'react-native-elements';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const pic1 = require('./assets/1.jpg');
const pic2 = require('./assets/2.jpg');
const pic3 = require('./assets/3.jpg');
const pic4 = require('./assets/4.jpg');
const pic5 = require('./assets/5.jpg');

const Users = [
    {
        id: '1', pics: [pic1, pic2], humanName: 'Alice', dogName: ['Fido', 'Alf'], bio: 'Let\'s go on a walk!',
    },
    {
        id: '2', pics: [pic3, pic4, pic5], humanName: 'Bob', dogName: ['Charlie', 'Seth', 'Edith'], bio: 'My dogs rule...',
    },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        marginTop: 66,
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    name: {
        fontSize: 32,
        fontWeight: '800',
        padding: 10,
    },
    dogs: {
        fontSize: 26,
        padding: 10,
    },
    bio: {
        fontSize: 18,
        padding: 10,
    },
    touchBox: {
        position: 'absolute',
        zIndex: 100,
        height: '15%',
        width: '100%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        margin: 10,
        bottom: 0,
    },
});

export default class App extends React.Component {
    constructor() {
        super();

        this.position = new Animated.ValueXY();
        this.state = {
            currentIndex: 0,
            currentProfileIndex: 0,
            showBio: false,
        };

        this.rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: ['-10deg', '0deg', '10deg'],
            extrapolate: 'clamp',
        });

        this.rotateAndTranslate = {
            transform: [{
                rotate: this.rotate,
            },
            ...this.position.getTranslateTransform(),
            ],
        };

        this.likeOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp',
        });

        this.nopeOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0, 0],
            extrapolate: 'clamp',
        });

        this.nextCardOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0, 1],
            extrapolate: 'clamp',
        });

        this.nextCardScale = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0.8, 1],
            extrapolate: 'clamp',
        });
    }

    // eslint-disable-next-line react/no-deprecated
    componentWillMount() {
        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (_evt, _gestureState) => true,
            onMoveShouldSetPanResponder: (_evt, gestureState) => {
                const { dx, dy } = gestureState;
                return (Math.abs(dx) > 20) || (Math.abs(dy) > 20);
            },
            onPanResponderMove: (evt, gestureState) => {
                const { showBio } = this.state;
                if (!showBio) {
                    this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                const { currentIndex, showBio } = this.state;
                if (showBio) {
                    return;
                }
                if (gestureState.dx > 120) {
                    Animated.spring(this.position, {
                        toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
                    }).start(() => {
                        this.setState({
                            currentIndex: currentIndex + 1,
                            currentProfileIndex: 0,
                        }, () => {
                            this.position.setValue({ x: 0, y: 0 });
                        });
                    });
                } else if (gestureState.dx < -120) {
                    Animated.spring(this.position, {
                        toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
                    }).start(() => {
                        this.setState({
                            currentIndex: currentIndex + 1,
                            currentProfileIndex: 0,
                        },
                        () => {
                            this.position.setValue({ x: 0, y: 0 });
                        });
                    });
                } else {
                    Animated.spring(this.position, {
                        toValue: { x: 0, y: 0 },
                        friction: 4,
                    }).start();
                }
            },
        });
    }

    changePic = (item) => {
        const { currentProfileIndex } = this.state;
        if (currentProfileIndex < item.pics.length - 1) {
            this.setState((prevState) => ({
                currentProfileIndex: prevState.currentProfileIndex + 1,
            }));
        } else {
            this.setState({
                currentProfileIndex: 0,
            });
        }
    }

    nextProf = () => {
        const { currentIndex } = this.state;
        this.setState({
            currentIndex: currentIndex + 1,
            currentProfileIndex: 0,
        },
        () => {
            this.position.setValue({ x: 0, y: 0 });
            this.setState({ showBio: false });
        });
    }

    showBio = () => {
        this.setState({ showBio: true });
    }

    hideBio = () => {
        this.setState({ showBio: false });
    }

    renderBio = (item) => {
        const { showBio } = this.state;
        if (showBio) {
            return (
                <View
                    style={{
                        height: 275,
                    }}
                >
                    <Modal
                        animationType="slide"
                        visible={showBio}
                        transparent
                    >
                        <View
                            style={{
                                paddingTop: Dimensions.get('window').height - 300,
                            }}
                        >
                            <View
                                style={styles.title}
                            >
                                <Text style={styles.name}>
                                    {item.humanName}
                                </Text>
                                <Icon
                                    name="arrow-up"
                                    type="font-awesome"
                                    color="#e75480"
                                    reverse
                                    onPress={this.hideBio}
                                />
                            </View>
                            <Text style={styles.dogs}>
                        Doggos:
                                {' '}
                                {item.dogName.join(', ')}
                            </Text>
                            <Text style={styles.bio}>
                                {item.bio}
                            </Text>
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                            >
                                <Icon
                                    name="check"
                                    type="font-awesome"
                                    color="green"
                                    reverse
                                    onPress={this.nextProf}
                                />
                                <Icon
                                    name="times"
                                    type="font-awesome"
                                    color="red"
                                    reverse
                                    onPress={this.nextProf}
                                />
                            </View>
                        </View>
                    </Modal>
                </View>
            );
        } else {
            return (
                <TouchableWithoutFeedback onPress={() => this.showBio(item)}>
                    <Animated.View
                        style={styles.touchBox}
                    />
                </TouchableWithoutFeedback>
            );
        }
    }

    renderUsers = () => {
        const { currentIndex, currentProfileIndex } = this.state;
        return Users.map((item, i) => {
            if (i < currentIndex) {
                return null;
            } else if (i === currentIndex) {
                return (
                    <Animated.View
                        {...this.PanResponder.panHandlers}
                        key={item.id}
                        style={[this.rotateAndTranslate, {
                            height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute',
                        }]}
                    >
                        <Animated.View style={{
                            opacity: this.likeOpacity,
                            transform: [{ rotate: '-30deg' }],
                            position: 'absolute',
                            top: 50,
                            left: 40,
                            zIndex: 1,
                        }}
                        >
                            <Text style={{
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: 'green',
                                color: 'green',
                                fontSize: 32,
                                fontWeight: '800',
                                padding: 10,
                            }}
                            >
                            LIKE
                            </Text>
                        </Animated.View>

                        <Animated.View style={{
                            opacity: this.nopeOpacity,
                            transform: [{ rotate: '30deg' }],
                            position: 'absolute',
                            top: 50,
                            right: 40,
                            zIndex: 1,
                        }}
                        >
                            <Text style={{
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: 'red',
                                color: 'red',
                                fontSize: 32,
                                fontWeight: '800',
                                padding: 10,
                            }}
                            >
                            NOPE
                            </Text>
                        </Animated.View>

                        <TouchableWithoutFeedback onPress={() => this.changePic(item)}>
                            <Animated.Image
                                style={{
                                    flex: 1,
                                    height: null,
                                    width: null,
                                    resizeMode: 'cover',
                                    borderRadius: 20,
                                }}
                                source={item.pics[currentProfileIndex]}
                            />
                        </TouchableWithoutFeedback>
                        {this.renderBio(item)}
                    </Animated.View>
                );
            } else {
                return (
                    <Animated.View
                        key={item.id}
                        style={{
                            opacity: this.nextCardOpacity,
                            transform: [{ scale: this.nextCardScale }],
                            height: SCREEN_HEIGHT - 120,
                            width: SCREEN_WIDTH,
                            padding: 10,
                            position: 'absolute',
                        }}
                    >
                        <Image
                            style={{
                                flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20,
                            }}
                            source={item.pics[currentProfileIndex]}
                        />
                    </Animated.View>
                );
            }
        }).reverse();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: 'Tinder4Dogz', style: { color: '#fff', fontSize: 20 } }}
                    rightComponent={{ icon: 'home', color: '#fff' }}
                    backgroundColor="#e75480"
                />
                <View style={{ flex: 1 }}>
                    {this.renderUsers()}
                </View>
                <View style={{ height: 60 }} />
            </View>
        );
    }
}
