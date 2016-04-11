import React, { Navigator, StyleSheet } from 'react-native';

import Login from './scenes/Login';

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
        initialRoute={{name: 'Scene 1', index: 0}}
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
    name: "Login2",
    renderer: (push, pop) => <Login push={push} pop={pop} />
  }
};
