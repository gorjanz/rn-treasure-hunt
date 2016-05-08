"use strict";

import React, {
  StyleSheet,
  View, Text, TextInput,
  Dimensions,
  TouchableHighlight
} from 'react-native';
import Spinner from '../components/Spinner';

import config from '../config';
import {saveToStorage} from '../utils/storage';
import {login} from '../utils/network';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default React.createClass({
  getInitialState() {
    return {
      username: null,
      errorMsg: null
    }
  },

  submitUsername() {
    const username = this.state.username;
    if (!username || username.length === 0) {
      this.setState({errorMsg: "Please provide a valid username..."});
      return;
    }

    const normalizedUsername = username.toLowerCase();

    const afterLogInFn = (data) => {
      if (data.error) {
        this.setState({
          username: username,
          errorMsg: "Username not recognized. Please try again...",
          loading: false
        });
        return;
      }

      console.log('Person with username: ', username, ' resolved to team: ', data.team);

      saveToStorage(
        config.storage.user.teamDetailsKey,
        JSON.stringify({
          username: normalizedUsername,
          team: data.team,
          albumId: data.albumId
        }),
        () => this.props.push(config.scenes.map)
      );
    };

    this.setState({ loading: true });
    login(normalizedUsername, afterLogInFn);
  },

  onTextChange(value) {
    this.setState({username: value, errorMsg: null});
  },

  render() {
    if (this.state.loading) {
      return (
        <Spinner/>
      )
    }

    let errorMessage;
    if (this.state.errorMsg) {
      errorMessage = (
        <Text style={styles.errorMessage}>{this.state.errorMsg}</Text>
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <Text style={styles.textLabel}>Login with your Username</Text>
          <TextInput
            value={this.state.username}
            style={styles.input}
            autoCapitalize="none"
            placeholderTextColor="#30638E"
            autoCorrect={false}
            autoFocus={true}
            onChangeText={(value) => this.onTextChange(value)}
            placeholder=" ex. agent007, etc..."
            onSubmitEditing={this.submitUsername}
          />
          <TouchableHighlight
            onPress={this.submitUsername}
            style={styles.submitButton}
            underlayColor={config.colors.pressHighlight}>
            <Text style={styles.submitText}>Join the Adventure</Text>
          </TouchableHighlight>
          {errorMessage}
        </View>
      </View>
    )
  }
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: config.colors.sceneBackgroundColor
  },
  inputWrapper: {
    paddingTop: SCREEN_HEIGHT * 0.4
  },
  textLabel: {
    width: SCREEN_WIDTH,
    textAlign: 'center',
    fontSize: 20,
    color: '#FFFFFF',
    paddingBottom: 10
  },
  errorMessage: {
    width: 0.9 * SCREEN_WIDTH,
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    backgroundColor: 'red',
    color: 'white',
    textAlign: 'center',
    borderRadius: 5
  },
  input: {
    width: 0.9 * SCREEN_WIDTH,
    paddingLeft: 10,
    alignSelf: 'center',
    height: 40,
    fontSize: 22,
    color: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: config.colors.borderColor
  },
  submitButton: {
    width: 0.9 * SCREEN_WIDTH,
    alignSelf: 'center',
    marginTop: 10,
    height: 35,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: config.colors.borderColor,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center'
  },
  submitText: {
    alignItems: 'center',
    color: '#30638E',
    fontSize: 18
  }
});
