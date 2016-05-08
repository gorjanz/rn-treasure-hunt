'use strict';

import React, {View, Text, StyleSheet, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import config from '../config';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textLabel}>Made with</Text>
        <Icon name={"heart"} size={70} color={"red"} />
        <Text style={styles.textLabel}>by @gorjanz</Text>
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
  textLabel: {
    width: SCREEN_WIDTH,
    textAlign: 'center',
    fontSize: 28,
    color: '#FFFFFF',
    paddingBottom: 10
  }
});
