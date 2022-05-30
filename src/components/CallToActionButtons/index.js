import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CallToActionButtons = ({ onHangupPress }) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  const onReverseCamera = () => {};

  const onToggleCamera = () => {
    setIsCameraOn((currentValue) => !currentValue);
  };

  const onToggleMicrophone = () => {
    setIsMicrophoneOn((currentValue) => !currentValue);
  };

  return (
    <View style={styles.buttonsContainer}>
      <Pressable onPress={onReverseCamera} style={styles.iconButton}>
        <Ionicons name="ios-camera-reverse" size={30} color="white" />
      </Pressable>

      <Pressable onPress={onToggleCamera} style={styles.iconButton}>
        <MaterialCommunityIcons
          name={isCameraOn ? 'camera-off' : 'camera'}
          size={30}
          color="white"
        />
      </Pressable>

      <Pressable onPress={onToggleMicrophone} style={styles.iconButton}>
        <MaterialCommunityIcons
          name={isMicrophoneOn ? 'microphone-off' : 'microphone'}
          size={30}
          color="white"
        />
      </Pressable>

      <Pressable
        onPress={onHangupPress}
        style={[styles.iconButton, { backgroundColor: 'red' }]}
      >
        <MaterialCommunityIcons name="phone-hangup" size={30} color="white" />
      </Pressable>
    </View>
  );
};

export default CallToActionButtons;

const styles = StyleSheet.create({
  buttonsContainer: {
    backgroundColor: '#333',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  iconButton: {
    backgroundColor: '#4a4a4a',
    borderRadius: 50,
    padding: 15,
  },
});
