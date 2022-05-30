import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CallToActionButtons from '../../components/CallToActionButtons';

const CallScreen = () => {
  return (
    <View style={styles.page}>
      <View style={styles.cameraPreview} />
      <CallToActionButtons />
    </View>
  );
};

export default CallScreen;

const styles = StyleSheet.create({
  page: {
    height: '100%',
    backgroundColor: '#7b4e80',
  },
  cameraPreview: {
    width: 100,
    height: 150,
    backgroundColor: '#fff',
    position: 'absolute',
    right: 20,
    top: 60,
    borderRadius: 10,
  },
});
