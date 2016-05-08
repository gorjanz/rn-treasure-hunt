'use strict';

import config from '../config';

import React, {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  NativeModules,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import MapView from 'react-native-maps';

const {CameraRoll} = React;
const ImagePickerManager = NativeModules.ImagePickerManager;

import {getMarkersForTeam} from '../utils/data';
import {saveImageDetails, getFromAsyncStorage, saveToStorage} from '../utils/storage';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default React.createClass({
  getInitialState() {
    return {
      region: config.region,
      markers: [],
      presentMarkerIndex: 0,
      isModalOpen: false
    };
  },

  componentDidMount() {
    const whenLoadedFn = (data) => {
      const teamDetails = JSON.parse(data);
      const markers = getMarkersForTeam(teamDetails.team);
      const playerUsername = teamDetails.username;

      // load game state from storage
      getFromAsyncStorage(config.storage.currentMarkerKey)
        .then((markerData) => {
          let currentMarker;
          if (markerData) {
            const parsedData = JSON.parse(markerData);
            currentMarker = parsedData.presentMarkerIndex;
          }

          this.setState({
            // start from the beginning if no game state is available
            presentMarkerIndex: currentMarker || 0,
            markers: markers,
            player: playerUsername,
            team: teamDetails.team,
            albumId: teamDetails.albumId
          });
        });
    };

    // load team details needed for selection of markers
    getFromAsyncStorage(config.storage.user.teamDetailsKey)
      .then(whenLoadedFn);
  },

  componentWillUnmount() {
    this.saveGameState(this.state.presentMarkerIndex);
  },

  saveGameState(markerIndex) {
    saveToStorage(config.storage.currentMarkerKey, JSON.stringify({ presentMarkerIndex: markerIndex}));
  },

  solveCheckpoint() {
    const passphrase = this.state.passphraseValue;
    const requiredPassphrase = this.state.markers[this.state.presentMarkerIndex].passphrase;
    if (passphrase && requiredPassphrase === passphrase.toLowerCase()) {
      console.log('Passphrase ', passphrase, ' is correct...');

      // If its the last checkpoint
      const nextMarkerIndex = this.state.presentMarkerIndex + 1;
      if (nextMarkerIndex >= this.state.markers.length) {
        console.log('Win... Going to End screen');
        this.props.push(config.scenes.end);
      } else {
        // move on to next checkpoint
        this.setState({ passphraseValue: null, isModalOpen: false, presentMarkerIndex: nextMarkerIndex });

        Alert.alert(
          'Congratulations',
          'You have unlocked the next Checkpoint. ' + nextMarkerIndex + ' down, ' +
          (this.state.markers.length - nextMarkerIndex) + ' to finish the Game.' );

        this.saveGameState(nextMarkerIndex);
      }
    } else {
      this.setState({ errorMsg: 'Wrong passphrase...' });
    }
  },

  showImagePicker() {
    const checkpoint = this.state.presentMarkerIndex;
    const belongsToTeam = this.state.team;
    const player = this.state.player;
    const shouldMoveToAlbum = this.state.albumId;

    ImagePickerManager.showImagePicker(config.imagePickerOptions, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }

      else {

        CameraRoll.saveImageWithTag(response.uri)
          .then(newUri => {
            saveImageDetails({
              uri: newUri,
              name: player.toUpperCase() + belongsToTeam + new Date().getTime() + ".jpg",
              team: belongsToTeam,
              checkpoint: checkpoint,
              albumId: shouldMoveToAlbum
            });
          });
      }
    });
  },

  openGallery() {
    saveToStorage(
      config.storage.currentMarkerKey,
      JSON.stringify({ presentMarkerIndex: this.state.presentMarkerIndex}),
      () => this.props.push(config.scenes.gallery)
    );
  },

  render() {
    let markerMarkup;
    if (this.state.markers.length !== 0) {
      const marker = this.state.markers[this.state.presentMarkerIndex];
      markerMarkup = (
        <MapView.Marker
          coordinate={marker.coordinate}>
          <Icon name={marker.iconName} size={30} color={marker.iconColor} />
        </MapView.Marker>
      )
    }

    let passphraseErrorMarkup;
    if (this.state.errorMsg) {
      passphraseErrorMarkup = (
        <Text style={styles.errorMessage}>{this.state.errorMsg}</Text>
      )
    }

    return (
      <View style={styles.container}>
        <MapView
          showsUserLocation={true}
          style={styles.map}
          initialRegion={this.state.region}
          mapType='hybrid'>
          {markerMarkup}
        </MapView>
        <Modal style={styles.modal} position={"center"} ref={"modal"} isDisabled={false} isOpen={this.state.isModalOpen}>
          <Text style={styles.textLabel}>Enter passphrase</Text>
          <TextInput
            value={this.state.passphraseValue}
            style={styles.input}
            autoCapitalize="none"
            placeholderTextColor="#30638E"
            autoCorrect={false}
            autoFocus={true}
            onChangeText={(value) => this.setState({ passphraseValue: value, errorMsg: null })}
            placeholder="e.g. swordfish"
            onSubmitEditing={this.solveCheckpoint}/>
          <TouchableHighlight
            onPress={this.solveCheckpoint} style={styles.submitButton}
            underlayColor={config.colors.pressHighlight}>
            <Text style={styles.submitText}>Unlock next Checkpoint</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => this.setState({isModalOpen: false, errorMsg: null })}
            style={styles.submitButton} underlayColor={config.colors.pressHighlight}>
            <Text style={styles.submitText}>Cancel</Text>
          </TouchableHighlight>
          {passphraseErrorMarkup}
        </Modal>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.setState({isModalOpen: true })}
            style={[styles.bubble, styles.button]}
            underlayColor={config.colors.pressHighlight}>
            <Text style={styles.buttonText}>Solve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.showImagePicker}
            style={[styles.bubble, styles.button]}
            underlayColor={config.colors.pressHighlight}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.openGallery}
            style={[styles.bubble, styles.button]}
            underlayColor={config.colors.pressHighlight}>
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  latlng: {
    width: 200,
    alignItems: 'stretch'
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: SCREEN_WIDTH,
    marginVertical: 20,
    backgroundColor: 'transparent'
  },
  buttonText: {
    color: config.colors.buttonTextColor
  },
  modal: {
    height: SCREEN_HEIGHT * 0.4,
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: config.colors.sceneBackgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  textLabel: {
    width: SCREEN_WIDTH * 0.7,
    textAlign: 'center',
    fontSize: 20,
    color: '#FFFFFF',
    paddingBottom: 10
  },
  errorMessage: {
    width: 0.7 * SCREEN_WIDTH,
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    backgroundColor: 'red',
    color: 'white',
    textAlign: 'center'
  },
  input: {
    width: 0.7 * SCREEN_WIDTH,
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
    width: 0.7 * SCREEN_WIDTH,
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
