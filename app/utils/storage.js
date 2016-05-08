'use strict';

import { AsyncStorage } from 'react-native';
import config from './../config';

/**
 * Save details for an image in AsyncStorage.
 *
 * @param imgObj Object denoting Image details which must contain uri and name, everything else is optional.
 */
export function saveImageDetails(imgObj) {
  getFromAsyncStorage(config.storage.rootKey)
    .then((value) => {
      let photos = extractPhotos(value);

      photos.push(imgObj);

      saveToStorage(config.storage.rootKey, JSON.stringify(photos));
    });
}

/**
 * Removes an image details object, if found in AsyncStorage, by using the URI as key.
 *
 * @param imgObj Object denoting Image details which must contain uri.
 */
export function removeSavedImage(imgObj) {
  getFromAsyncStorage(config.storage.rootKey)
    .then((value) => {
      let photos = extractPhotos(value);

      const updatedPhotos = photos.filter(savedPhoto => savedPhoto.uri !== imgObj.uri);

      saveToStorage(config.storage.rootKey, JSON.stringify(updatedPhotos));
    });
}

/**
 * Get all saved images.
 *
 * @returns {Array} of objects containing uri and name, empty if no images are saved yet.
 */
export function getTakenImages(callbackFn) {
  getFromAsyncStorage(config.storage.rootKey)
    .then((value) => {
      let photos = extractPhotos(value);
      if (callbackFn) {
        callbackFn(photos);
      }
    });
}


/**
 * Helper function which handles the saving of a key/value pair to AsyncStorage.
 *
 * @param {String} key
 * @param {String} value
 * @param {Function} successHandler fn to execute if all goes well
 */
export function saveToStorage(key, value, successHandler) {
  AsyncStorage.setItem(key, value)
    .then(() => {
      console.log('SUCCESS - new value for key:', key, ' is:', value);
      if (successHandler) {
        successHandler(value);
      }
    })
    .catch((error) => console.log('ERROR when writing to AsyncStorage: ', error));
}

/**
 * Get a value for a key from data stored in AsyncStorage.
 *
 * @param key
 * @returns {Promise}
 */
export function getFromAsyncStorage(key) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key, (error, result) => {
      if (error) {
        console.log('Error in accessing AsyncStorage: ', error);
        reject(error);
        return;
      }

      console.log('AsyncStorage data retrieved: ', result);
      resolve(result);
    });
  })
}

/**
 * Helper function which parses the returned data from AsyncStorage.
 * Returns an empty Array if no data is found.
 *
 * @param value
 * @returns {Array}
 */
function extractPhotos(value) {
  return value ? JSON.parse(value) : [];
}
