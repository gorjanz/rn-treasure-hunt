import React, { AppRegistry } from 'react-native';
import App from './app/App';

const RNTreasureHunt = React.createClass({
  render() {
    return (
      <App/>
    );
  }
});

AppRegistry.registerComponent('RNTreasureHunt', () => RNTreasureHunt);
