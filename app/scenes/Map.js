'use strict';

import React, {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import MapView from 'react-native-maps';
import config from '../config';

export default React.createClass({
  getInitialState() {
    return {
      region: config.region,
      markers: config.markers
    };
  },

  render() {
    const { region, markers } = this.state;
    return (
      <View style={styles.container}>
        <MapView
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
                description={'Description ' + index}
              />
            )
          })}
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => this.props.pop()} style={[styles.bubble, styles.button]}>
            <Text>Back</Text>
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
