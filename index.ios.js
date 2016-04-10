import React, {Component, AppRegistry }from 'react-native';
import App from './app/app';

class RNTreasureHunt extends Component {
  render() {
    return (
      <App/>
    );
  }
}


AppRegistry.registerComponent('RNTreasureHunt', () => RNTreasureHunt);
