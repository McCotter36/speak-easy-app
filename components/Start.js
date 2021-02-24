import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, ImageBackground, KeyboardAvoidingView } from 'react-native';
import { Directions, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';

//Start Component renders start screen and takes typed Text to pass to Chat Screen title. 
export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: '',
      color: ''
    };
  }
  
  render () {
    return (
      <ImageBackground 
          source={require('../assets/BackgroundImage.png')}
          style={styles.backgroundImage}
          >
      <View style={styles.fullContainer}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Speak Easy</Text>
        </View>
        <View style={styles.yourInput}>
          <TextInput
            style={styles.yourName}
            //listens for typed text, will set that text as state to be passed to Chat Component onPress
            onChangeText={(name) => this.setState({name})}
            value={this.state.name}
            placeholder="Your Name"
            />
          <View style={ styles.yourColorContainer}>
            <Text style={styles.yourColorText}>Choose Background Color:</Text>
            <View style={styles.yourColors}>
              <TouchableOpacity
                style={[styles.color, { backgroundColor: '#090C08' }]}
                onPress={() => {
                  this.setState({ color: '#090C08' })
                }}
                />
              <TouchableOpacity
                style={[styles.color, { backgroundColor: '#474056' }]}
                onPress={() => {
                  this.setState({ color: '#474056' })
                }}
              />
              <TouchableOpacity 
                style={[styles.color, { backgroundColor: '#8A95A5' }]}
                onPress={() => {
                  this.setState({ color: '#8A95A5'})
                }}
              />
              <TouchableOpacity
                style={[styles.color, { backgroundColor: '#B9C6AE' }]}
                onPress={() => {
                  this.setState({ color: '#B9C6AE' })
                }}
                />
            </View>
          </View>
          <TouchableOpacity
            style ={styles.chatButton}
            //button calls navigate to Chat Component
            onPress={
              //Assigns typed text to Chat Name Prop through Start State
              //Assigns selected color to Chat color Prop through Start State
              () => this.props.navigation.navigate('Chat', {
                name: this.state.name,
                color: this.state.color,
              })
            }
          >
            <Text style={styles.chatText}>Begin Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
      { Platform.OS === 'android' ? (<KeyboardAvoidingView behavior='height' />) : null }

      </ImageBackground>
    )
  }
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
  },
  fullContainer: {
    width: '100%',
    height: '100%',
  },
  titleBox: {
    flex: 1,
    height: '56%',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 45,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: '20%',
  },
  yourInput: {
    flex: 2,
    marginHorizontal: '6%',
    height: 350,
    width: '88%',
    position: 'absolute',
    backgroundColor: '#FFF',
    bottom: 10,
    borderRadius: 10,
    padding: '6%',
  },
  yourName: {
    height: 60,
    position: 'relative',
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 'auto',
    textAlign: 'center',
    width: '100%',
    borderRadius: 10,
  },
  yourColorContainer: {
    flex: 1,
    marginTop: 20,
    },
  yourColorText: {
    fontSize: 14,
    height: 50,
  },
  yourColors: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  color: {
    width: 50,
    height: 50,
    borderRadius: 50/2,
  },
  chatButton: {
    height: 60,
    width: '100%',
    backgroundColor: '#757083',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    position: 'relative',
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 0,
  },
  chatText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    justifyContent: 'space-around',
  }
});