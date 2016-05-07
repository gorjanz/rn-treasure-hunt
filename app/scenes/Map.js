'use strict';

import React, {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  NativeModules,
  CameraRoll
} from 'react-native';
import { uploadPhoto } from '../utils/network';

import MapView from 'react-native-maps';
import config from '../config';

import Icon from 'react-native-vector-icons/FontAwesome';
const ImagePickerManager = NativeModules.ImagePickerManager;

export default React.createClass({
  getInitialState() {
    return {
      region: config.region,
      markers: config.markers
    };
  },

  _takePhoto() {
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
            console.log('new uri: ', newUri);

            CameraRoll.getPhotos({first: 1}).then(data => {
              const imageObj = {
                uri: data.edges[0].node.image.uri,
                name: "image" + new Date().getTime() + ".jpg"
              };

              // upload photo to server
              uploadPhoto(config.upload.endpoint, imageObj, null, null, null);
            });
          });
      }
    });
  },

  render() {
    const {region, markers} = this.state;
    return (
      <View style={styles.container}>
        <MapView
          showsUserLocation={true}
          style={styles.map}
          initialRegion={region}
          mapType='hybrid'
        >
          {markers.map((marker, index) => {
            return (
              <MapView.Marker
                ref={'m' + index}
                key={'m' + index}
                coordinate={markers[index].coordinate}
                title={'Checkpoint ' + index}
                description={'Description ' + index}>
                <Icon name={marker.iconName} size={30} color={marker.iconColor}/>
              </MapView.Marker>
            )
          })}
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => this.props.pop()} style={[styles.bubble, styles.button]}>
            <Text>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._takePhoto} style={[styles.bubble, styles.button]}>
            <Text>Take Photo</Text>
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
    marginVertical: 20,
    backgroundColor: 'transparent'
  }
});
