import React from 'react-native';
const {View, Text, TouchableHighlight} = React;

export default React.createClass({
  displayName: "Login",

  render() {
    return (
      <View>
        <TouchableHighlight style={{paddingTop: 30}} onPress={() => this.props.push(1)}>
          <Text>{'Go Forward'}</Text>
        </TouchableHighlight>
        <Text>{this.props.name}</Text>
        <TouchableHighlight onPress={() => this.props.pop()}>
          <Text>{'Go Back'}</Text>
        </TouchableHighlight>
      </View>
    )
  }
});