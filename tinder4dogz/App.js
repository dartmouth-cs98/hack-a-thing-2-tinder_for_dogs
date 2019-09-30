import React from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, Image, PanResponder, TouchableWithoutFeedback, Button } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const Users = [
  {id: "1", pics: [require('./assets/1.jpg'), require('./assets/2.jpg')]},
  {id: "2", pics: [require('./assets/3.jpg'), require('./assets/4.jpg'), require('./assets/5.jpg')]}
]

// export default class App extends React.Component {
class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Tinder4Dogs",
      headerRight: (
        <Button
          title="Profile"
          onPress={() => navigation.navigate('Profile', {name: 'Jane'})}
        />
      ),
    };
  };

  constructor() {
    super()

    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0,
      currentProfileIndex: 0
    }

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    })

    this.rotateAndTranslate = {
      transform: [{
          rotate: this.rotate,
        },
        ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    })

    this.nopeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp',
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp',
    })

    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp',
    })
  }

  componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder:(evt, gestureState) => false,
      onMoveShouldSetPanResponder : (evt, gestureState) => {
        const {dx, dy} = gestureState;
        return (Math.abs(dx) > 20) || (Math.abs(dy) > 20);
      },
      onPanResponderMove:(evt, gestureState) => {
        this.position.setValue({x:gestureState.dx, y:gestureState.dy})
      }, 
      onPanResponderRelease:(evt, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1, currentProfileIndex: 0}, () => {
              this.position.setValue({ x: 0, y: 0})
            })
          })
        } else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1, currentProfileIndex: 0}, () => {
              this.position.setValue({ x: 0, y: 0})
            })
          })
        } else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
          }).start()
        }
      }
    })
  }

  changePic = (item) => {
    if (this.state.currentProfileIndex < item.pics.length - 1) {
      this.setState(prevState => ({
        currentProfileIndex: prevState.currentProfileIndex + 1
      }))
    } else {
      this.setState({
        currentProfileIndex: 0
      })
    }
  }

  renderUsers = () => {
    return Users.map((item, i) => {
      if (i < this.state.currentIndex) {
        return null
      } else if (i === this.state.currentIndex) {
        return(
          <Animated.View 
            {...this.PanResponder.panHandlers}
            key={item.id}
            style={[this.rotateAndTranslate, {height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute'}]}
          >
            <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1 }}>
              <Text style={{ borderRadius: 5, borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10}}>LIKE</Text>
            </Animated.View>

            <Animated.View style={{ opacity: this.nopeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1 }}>
              <Text style={{ borderRadius: 5, borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10}}>NOPE</Text>
            </Animated.View>

            <TouchableWithoutFeedback onPress={() => this.changePic(item)}>
              <Animated.Image
                style={{flex:1, height:null, width:null, resizeMode:'cover', borderRadius: 20}}
                source={item.pics[this.state.currentProfileIndex]}
              />
            </TouchableWithoutFeedback>
          </Animated.View>
        )
      } else {
        return(
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
              style={{flex:1, height:null, width:null, resizeMode:'cover', borderRadius: 20}}
              source={item.pics[this.state.currentProfileIndex]}
            />
          </Animated.View>
        )
      }
    }).reverse()
  }

  render() {
    return (
      <View style={{flex:1}}>
        <View style={{height:60}}>
        
        </View>
        <View style={{flex:1}}>
          {this.renderUsers()}
        </View>
        <View style={{height:60}}>

        </View>
      </View>
    );
  }
}

class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <Button
        title="Go to Jane's profile"
        onPress={() => navigate('Profile', {name: 'Jane'})}
      />
    );
  }
}

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Profile: {screen: ProfileScreen},
});
const App = createAppContainer(MainNavigator);
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
