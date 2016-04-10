import React, {View, Text, TouchableHighlight, StyleSheet} from 'react-native';

export default React.createClass({
  render() {
    return (
      <View>
        <TouchableHighlight style={styles.button} onPress={this.props.onForward}>
          <Text>{'GoForward'}</Text>
        </TouchableHighlight>
        <Text>{this.props.name}</Text>
        <TouchableHighlight onPress={this.props.onBack}>
          <Text>{'GoBack'}</Text>
        </TouchableHighlight>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  button: {
    paddingTop: 60,
  }
});