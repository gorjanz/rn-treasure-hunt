"use strict";

import React, {
  StyleSheet,
  View, Text, Image, TouchableOpacity, ScrollView,
  Dimensions
} from 'react-native';
import Spinner from '../components/Spinner';
import CheckBox from 'react-native-circle-checkbox';
import Swiper from 'react-native-swiper';

import config from '../config';

import {getTakenImages} from '../utils/storage';
import {uploadPhotos} from '../utils/network';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default React.createClass({
  getInitialState() {
    return {
      loading: true
    }
  },

  componentDidMount() {
    getTakenImages((images) => this.setState({ images: images, loading: false, activeImage: 0}));
  },

  renderImages(images) {
    return images.map((image, i) => {
      return (
        <View key={i}>
          <Image source={image} style={styles.imgStyle} />
          <Text style={styles.imgText}>{'Taken at checkpoint ' + image.checkpoint}</Text>
          <View style={styles.checkboxContainer}>
            <CheckBox
              label="Select Photo"
              innerColor="#D1495B"
              outerColor="#D1495B"
              checked={this.state.images[i].selected}
              onToggle={(checked) => {
                  const alteredImages = this.state.images;
                  const photo = Object.assign({}, alteredImages[i]);
                  photo.selected = checked;
                  alteredImages.splice(i, 1, photo);

                  this.setState({images: alteredImages, activeImage: i});
                }}
            />
          </View>
        </View>
      )
    });
  },

  uploadImages() {
    uploadPhotos(
      this.state.images.filter(image => image.selected === true),
      () => this.setState({ loading: true }),
      () => this.setState({ loading: false })
    );
  },

  render() {
    if (this.state.loading) {
      return (
        <Spinner/>
      )
    }

    return (
      <View style={styles.container}>
        <Swiper showsButtons={false} index={this.state.activeImage} loop={false}>
          {this.renderImages(this.state.images)}
        </Swiper>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.props.pop()}
            style={[styles.bubble, styles.button]}
            underlayColor={config.colors.pressHighlight}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.uploadImages}
            style={[styles.bubble, styles.button]}
            underlayColor={config.colors.pressHighlight}>
            <Text style={styles.buttonText}>Upload Photos</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
});

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingTop: 30,
    paddingBottom: 45,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: config.colors.sceneBackgroundColor
  },
  imgStyle: {
    flex:1,
    alignSelf: 'center',
    margin: 10,
    marginTop: SCREEN_HEIGHT * 0.2,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT / 2,
    borderWidth: 1,
    borderColor: 'black'
  },
  imgText: {
    flex: 1,
    alignSelf: 'center',
    fontSize: 16,
    color: '#001242'
  },
  checkboxContainer: {
    flex: 1,
    padding: 20,
    alignSelf: 'center'
  },
  buttonContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10
  },
  buttonText: {
    color: config.colors.buttonTextColor
  }
});
