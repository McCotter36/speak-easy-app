import React from 'react';
import Chat from './components/Chat';
import Start from './components/Start';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          //First screen rendered will be Start
          initialRouteName="Start"
        >
          <Stack.Screen
            //render Start Component
            name="Start"
            component={Start}
          />
          <Stack.Screen
            //render Chat component
            name="Chat"
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },

})