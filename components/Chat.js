import { setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { Component } from 'react';
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  Platform, 
  KeyboardAvoidingView 
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
const firebase = require('firebase');
require('firebase/firestore');

console.disableYellowBox = true;

//Chat Component to render chat UI
class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    }

    // firestore configuration 
    const firebaseConfig = {
      apiKey: "AIzaSyBgf5rm_JbZKeFpCWTOqnPMyiEenKNedys",
      authDomain: "speak-easy-70b1d.firebaseapp.com",
      projectId: "speak-easy-70b1d",
      storageBucket: "speak-easy-70b1d.appspot.com",
      messagingSenderId: "766303669968",
      appId: "1:766303669968:web:f37ec6eaed4ea5dc0498d5",
      measurementId: "G-C4QJTX4H8T"
    };

    //check if app is initialized to keep from initializing more than one
    if (!firebase.apps.length) {
      //initialize app using above configuration variable
      firebase.initializeApp(firebaseConfig);
    } 
    //reference messages
    // this.referenceChatMessages = null;

  }
  addMessage() {
    this.referenceChatMessages.add(

    )

  }
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  // Properties of the message bubble (right or left)
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  render () {
    //screen color from Start screen
    let color = this.props.route.params.color;
   
    return (
      <View style={[styles.container, {backgroundColor: color }]}>
         <Button
          title="Go to Start"
          //navigates user back to start Component
          onPress={() => this.props.navigation.navigate('Start')}
          />
        <GiftedChat
        renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      {/* android specific fix prevents keyboard from hiding input */} 
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null }
      </View>
    );
  }

  componentDidMount() {
    //set title of Chat component to name entered in Start input
    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
      });
      this.unsubscribe = this.referenceChatMessages
      .orderBy("createdAt", "desc")
      .onSnapshot(this.onCollectionUpdate);
    });

    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
        },
      ],
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();

  }
}

  const styles = StyleSheet.create({
    container: {
      flex: 1, 
  },
});

export default Chat;