import React, { Component } from 'react';
import { 
  Alert,
  View, 
  Text, 
  Button, 
  StyleSheet, 
  Platform, 
  KeyboardAvoidingView, 
  LogBox,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import MapView, { Marker } from 'react-native-maps';
import CustomActions from './CustomActions';

//Chat Component to render chat UI
export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      isConnected: false,
      loggedInText: 'Please wait while you are logged in.',
      image: null,
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
      'Possible Unhandled',
      'Animated.event'
    ])
  }

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  }

  // get locally stored messages
  getMessages = async () => {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // save messages to local storage
  saveMessages = async () => {
    try{
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // delete locally stored messages
  deleteMessages = async () => {
    try{
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
        image: null,
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  // Will only render message input when user is online
  renderInputToolbar(props) {
    if (this.state.isConnected !== true) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  // render chat bubble with different color
  renderBubble(props){
    return(
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#228B22',
          },
        }}
      />
    )
  }

  componentDidMount() {
    //set title of Chat component to name entered in Start input
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    
    // sign in Anonymously with firebase and listen for Auth State Change
      this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
          firebase.auth().signInAnonymously();
        }
        // add user uid to state
        this.setState({
          uid: user.uid,  
          loggedInText: "Welcome",
          messages: [],
        }); 
        this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
      });
    } 

  componentWillUnmount() {
    // stops listening for changes
    this.unsubscribe();
    // stops listening for authentication changes
    this.authUnsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // iterate through each document
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || '',
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({ messages });
  };

  /** checks if user is online */
  handleConnectivityChange = (state) => {
    const isConnected = state.isConnected;
    if (isConnected == true) {
      this.setState({
        isConnected: true,
      });
      // listen for changes to messages
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    } else {
      this.setState({
        isConnected: false,
      });
      // Load messages
      this.getMessages();
      Alert.alert(
        'Please connect to a network to send messages'
      )
    }
  };

  /** adds message to firestore, triggered by onSend function */
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
  };
  
  /** renders communication features expand button */
  renderCustomActions = (props) => <CustomActions {...props} />;

  /** renders custom map view */
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      //declare variables for lat and long for ease of code
    const lat = currentMessage.location.latitude;
    const long = currentMessage.location.longitude;
      return (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.mapView}
            region={{
              latitude: lat,
              longitude: long,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{latitude: lat, longitude: long, latitudeDelta: 0.02}}
              pinColor={'red'}
            />
          </MapView>
        </View>
      );
    }
    return null;
  }

  render () {
    //screen color from Start screen
    let color = this.props.route.params.color;
   
    return (
      <View style={[styles.container, {backgroundColor: color }]}>
        {/* <Text style={styles.welcome}>{this.state.loggedInText}</Text> */}
        {/* <View style={styles.buttonView}>
          <Button 
            title='Delete Messages'
            onPress={() => this.deleteMessages()}
          />
          </View> */}
        <GiftedChat
          messages={this.state.messages}
          isConnected={this.state.isConnected}
          //renderInputToolbar={this.renderInputToolbar}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          renderBubble={this.renderBubble.bind(this)}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.uid,
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
  mapContainer: {
    width: 150, 
    height: 100, 
    margin: 3,  
    borderRadius: 13, 
    overflow: 'hidden' 
  },
  mapView: {
    alignSelf: 'center',
    width: '100%', 
    height: '100%', 
    borderRadius: 13 
  },
  buttonView: {
    alignItems: 'center',
  },
  chatView: {
  }
});
