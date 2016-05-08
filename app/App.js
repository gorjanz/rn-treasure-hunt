import React, { Navigator } from 'react-native';
import config from './config';

import Login from './scenes/Login';
import Map from './scenes/Map';
import Gallery from './scenes/Gallery';

export default React.createClass({
  displayName: "Application",
  
  pushScene(navigator, sceneIndex) {
    const scene = scenes[sceneIndex];
    
    navigator.push({
      name: scene.name,
      index: sceneIndex
    });
  },
  
  popScene(navigator, currentSceneIndex) {
    if (currentSceneIndex > 0) {
      navigator.pop();
    }
  },
  
  _renderScene(route, navigator) {
    const scene = scenes[route.index];
    
    return scene.renderer(
      (sceneIndex) => this.pushScene(navigator, sceneIndex),
      () => this.popScene(navigator, route.index)
    );
  },
  
  render() {
    return (
      <Navigator
        initialRoute={{name: 'Login', index: config.scenes.login}}
        renderScene={this._renderScene}
      />
    );
  }
});

const scenes = {
  0: {
    name: "Login",
    renderer: (push, pop) => <Login push={push} pop={pop} />
  },
  1: {
    name: "Map",
    renderer: (push, pop) => <Map push={push} pop={pop} />
  },
  2: {
    name: "Gallery",
    renderer: (push, pop) => <Gallery push={push} pop={pop} />
  },
  3: {
    name: "End",
    renderer: (push, pop) => <End push={push} pop={pop} />
  }
};
