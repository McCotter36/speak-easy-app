import { setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { Component } from 'react';
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  Platform, 
  KeyboardAvoidingView, 
  LogBox
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

//Chat Component to render chat UI
class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      loggedInText: 'Please wait while you are logged in.'
    };

    // firestore configuration 
    var firebaseConfig = {
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
    // Reference Chat messages in firebase
    this.referenceChatMessages = firebase.firestore().collection("messages");

    // Ignores warning messages specified
    LogBox.ignoreLogs([
      'Setting a timer',
      'undefined',
    ])
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // iterate through each document
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({ messages });
  };

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      uid: this.state.uid,
      createdAt: message.createdAt,
      text: message.text || '',
      user: message.user,
      image: message.image || '',
      location: message.location || null,
    });
  }

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
      }
    );
  }

  componentDidMount() {
    //set title of Chat component to name entered in Start input
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // Listen for collection changes for current user
    this.referenceChatMessages = firebase.firestore().collection("messages")
    // ==== disabled uid in favor of loading all messages for the time being
    // .where("uid", "==", this.state.uid)
    ;

    // sign in Anonymously with firebase and listen for Auth State Change
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      // add user uid to state
      this.setState({
        uid: user.uid,
        user: {
          _id: user.uid,
          name: name,
          avatar: 'https://placeimg.com/140.140.any',
        },  
        loggedInText: "Welcome",
        messages: [],
      });
      // listen for changes to messages
      this.unsubscribeChatMessageUser = this.referenceChatMessages
      .orderBy("createdAt", "desc")
      .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    // stops listening for changes
    this.unsubscribeChatMessageUser();
    // stops listening for authentication changes
    this.authUnsubscribe();
  }

  render () {
    //screen color from Start screen
    let color = this.props.route.params.color;
   
    return (
      <View style={[styles.container, {backgroundColor: color }]}>
        <Text style={styles.welcome}>{this.state.loggedInText}</Text>
         <View style={styles.buttonView}>
         <Button
          title="Go to Start"
          color="purple"
          style={styles.button}
          //navigates user back to start Component
          onPress={() => this.props.navigation.navigate('Start')}
          />
          </View>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      {/* android specific fix prevents keyboard from hiding input */} 
      { Platform.OS === 'android' ? (<KeyboardAvoidingView behavior='height' />) : null }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
  },
  buttonView: {
    flex: 1,
    alignItems: 'center',
  }
});

export default Chat;