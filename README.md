# Speak Easy

A messaging application for mobile devices developed with React Native, Expo's Gifted Chat and Google Firebase. The app will provide users with a chat interface and options to share images and their location.

## Features

A Start screen where you can choose a username as well as a background color for your Chat screen
A Chat screen where you can type and submit text messages, send images (from your Media Gallery and/or your Camera) as well as send location data displayed as a custom map view
The chat-app will ask permission to access your Media Gallery, Camera and location data
All messages are stored in Google Firebase Cloud Storage
When offline, users can still view their conversations (using asyncStorage)

## Setup

### • Expo

Expo is a framework and a platform for universal React applications. It is a set of tools and services built around React Native and native platforms that help you develop, build, deploy, and quickly iterate on iOS, Android, and web apps from the same JavaScript/TypeScript codebase.

To use Expo you will need to sign-up for an account: https://expo.io/signup
You can install Expo on your device using the CLI `$ npm install --global expo-cli`

### • Android Emulator: Android Studio

Android Studio provides a unified environment where you can build apps for Android phones, tablets, Android Wear, Android TV, and Android Auto. Structured code modules allow you to divide your project into units of functionality that you can independently build, test, and debug. For the chat-app you will just need to use the Android Emulator function.

Download available [here](https://developer.android.com/studio).

### • Set up a Firebase database

The Firebase Realtime Database is a cloud-hosted database. Data is stored as JSON and synchronized in realtime to every connected client. When you build cross-platform apps with our iOS, Android, and JavaScript SDKs, all of your clients share one Realtime Database instance and automatically receive updates with the newest data.

For a step by step process, please visit [this link](https://codinglatte.com/posts/how-to/how-to-create-a-firebase-project/).

### • Clone the repository and integrate your Firebase configuration info into the Chat.js file

Clone the repo using `$ git clone https://github.com/McCotter36/speak-easy-app.git` and open the Chat.js file. On line 34 you will find the Firebase configuration. Integrate your configuration info here.

### • Install all dependencies for the speak easy app

In your Terminal go to the project directory using `$ cd speak-easy-app`. From within this directory execute `$ npm install` to install all dependencies for the speak-easy-app

Run the app by executing `$ npm start` or `$ expo start`