import React, {View, Navigator} from 'react-native';
import BasicScene from './scenes/Basic';
import BasicScene2 from './scenes/Basic2';

export default React.createClass({
  render() {
    return (
      <Navigator
        initialRoute={{name: 'Scene 1', index: 0}}
        renderScene={(route, navigator) => {
          const onForward = () => {
            var nextIndex = route.index + 1;
            navigator.push({
              name: 'Scene ' + (nextIndex + 1),
              index: nextIndex
            });
          };
          const onBack = () => {
            if (route.index > 0) {
              navigator.pop();
            }
          };
      
          if (route.index === 1) {
            return (
              <BasicScene2
                name={route.name}
                onForward={onForward}
                onBack={onBack}
              />
            );
          } else {
            return (
              <BasicScene
                name={route.name}
                onForward={onForward}
                onBack={onBack}
              />
            );
          }
        }
      }
      />
    )
  }
});