import React, { Navigator } from 'react-native';
import config from './config';

import Spinner from './components/Spinner';
import Onboarding from './scenes/Onboarding';
import Login from './scenes/Login';
import Map from './scenes/Map';
import Gallery from './scenes/Gallery';
import End from './scenes/End';

import { getFromAsyncStorage } from './utils/storage';

export default React.createClass({
  displayName: "Application",

  componentWillMount() {
    this.setState({ loading: true });

    const transitionTo = (data) => {
      let onboardingPassed;
      if (data) {
        const onboardingState = JSON.parse(data);
        onboardingPassed = onboardingState.onboardingPassed;
      } else {
        onboardingPassed = false;
      }

      if (!onboardingPassed) {
        console.log('first time app is used');
        this.setState({ loading: false, scene: config.scenes.onboarding });
        return;
      } else {
        console.log('skipping onboarding process');
        getFromAsyncStorage(config.storage.user.teamDetailsKey)
          .then((data) => {
            let username;
            if (data) {
              const dataObj = JSON.parse(data);
              username = dataObj.username;
            }

            this.setState({ scene: username ? config.scenes.map : config.scenes.login });
          });
        return;
      }
    };

    getFromAsyncStorage(config.storage.firstOpenKey)
      .then(transitionTo);
  },

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
    if (this.state.loading) {
      return <Spinner/>;
    }

    return (
      <Navigator
        initialRoute={{name: 'Login', index: this.state.scene}}
        renderScene={this._renderScene}
      />
    );
  }
});

const scenes = {
  0: {
    name: "Onboarding",
    renderer: (push, pop) => <Onboarding push={push} pop={pop} />
  },
  1: {
    name: "Login",
    renderer: (push, pop) => <Login push={push} pop={pop} />
  },
  2: {
    name: "Map",
    renderer: (push, pop) => <Map push={push} pop={pop} />
  },
  3: {
    name: "Gallery",
    renderer: (push, pop) => <Gallery push={push} pop={pop} />
  },
  4: {
    name: "End",
    renderer: (push, pop) => <End push={push} pop={pop} />
  }
};
