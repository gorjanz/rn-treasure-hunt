'use strict';

import React, {View, Text, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import Spinner from '../components/Spinner';
import Swiper from 'react-native-swiper';

import config from '../config';
import {saveToStorage} from '../utils/storage';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const image1 = require('../resources/scene1.png');
const image2 = require('../resources/scene2.png');
const image3 = require('../resources/scene3.png');

export default React.createClass({
  displayName: 'OnboardingScreens',

  getInitialState() {
    return {activeStep: 0};
  },

  cardDetails: {
    0: {
      left: 'Skip',
      right: 'Next',
      image: image1,
      text: 'Step 1: Get to the checkpoint'
    },
    1: {
      left: 'Back',
      right: 'Next',
      image: image2,
      text: 'Step 2: Take a fun group photo'
    },
    2: {
      left: 'Back',
      right: 'Login',
      image: image3,
      text: 'Step 3: After you finish the game, upload the photos, so everyone can see them'
    }
  },

  handleLeftButtonClick(activeScene) {
    switch (activeScene) {
      case 0:
        this.goToLogin();
        break;

      default:
        this.goToPreviousCard();
        break;
    }
    return;
  },

  handleRightButtonClick(activeScene) {
    switch (activeScene) {
      case 2:
        this.goToLogin();
        break;

      default:
        this.goToNextCard();
        break;
    }
    return;
  },

  goToLogin() {
    this.setState({ loading: true });
    const whenSavedFn = () => this.props.push(config.scenes.login);

    saveToStorage(config.storage.firstOpenKey, JSON.stringify({ onboardingPassed: true}), whenSavedFn);
  },

  goToNextCard() {
    this.setState({ activeStep: (this.state.activeStep + 1) });
  },

  goToPreviousCard() {
    this.setState({ activeStep: (this.state.activeStep - 1) });
  },

  render() {
    const {left, right, image, text} = this.cardDetails[this.state.activeStep];
    if (this.state.loading) {
      return (
        <Spinner/>
      )
    };

    return (
      <View style={styles.container}>
        <Swiper contentContainerStyle={styles.swiperContainer} showsButtons={false}
                index={this.state.activeStep} loop={false}
                onMomentumScrollEnd={(e, state, context) => this.setState({activeStep : state.index})}>
          <OnboardingCard explanationText={text} image={image} key="1"/>
          <OnboardingCard explanationText={text} image={image} key="2"/>
          <OnboardingCard explanationText={text} image={image} key="3"/>
        </Swiper>
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            onPress={() => this.handleLeftButtonClick(this.state.activeStep)}
            activeOpacity={0.5}
            style={styles.button}>
            <Text style={styles.buttonText}>{left}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.handleRightButtonClick(this.state.activeStep)}
            activeOpacity={0.5}
            style={styles.button}>
            <Text style={styles.buttonText}>{right}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
});

const OnboardingCard = React.createClass({
  render() {
    return (
      <View style={styles.card} key={"card" + this.props.key}>
        <Image style={styles.cardImage} source={this.props.image} key={"image" + this.props.key}/>
        <Text style={styles.cardText} key={"text" + this.props.key}>{this.props.explanationText}</Text>
      </View>
    )
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.sceneBackgroundColor
  },
  swiperContainer: {
    height: SCREEN_HEIGHT * 0.8,
    alignItems: 'flex-start'
  },
  card: {
    flex: 1,
    width: SCREEN_WIDTH,
    padding: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: config.colors.sceneBackgroundColor
  },
  cardImage: {
    paddingTop: SCREEN_HEIGHT * 0.35,
    height: SCREEN_HEIGHT * 0.3,
    width: SCREEN_WIDTH * 0.7,
    alignSelf: 'center'
  },
  cardText: {
    paddingTop: 20,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: 'center',
    textAlign: 'center'
  },
  navigationButtons: {
    position: 'absolute',
    bottom: 10,
    borderTopWidth: 1,
    borderTopColor: config.colors.borderColor,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.1,
    flexDirection: 'row'
  },
  button: {
    width: SCREEN_WIDTH * 0.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22
  }
});
