'use strict';

import React, {View, StyleSheet} from 'react-native';
import Spinner from 'react-native-spinkit';
import config from '../config';

export default React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <Spinner
          style={styles.spinner}
          isVisible={true}
          size={80}
          type={'9CubeGrid'}
          color={config.colors.spinnerAnimationColor}/>
      </View>
    )
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: config.colors.sceneBackgroundColor
  },
  spinner: {
    margin: 30
  }
});
