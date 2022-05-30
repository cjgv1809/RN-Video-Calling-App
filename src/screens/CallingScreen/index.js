import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import CallToActionButtons from '../../components/CallToActionButtons';
import { Voximplant } from 'react-native-voximplant';

const permissions = [
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  PermissionsAndroid.PERMISSIONS.CAMERA,
];

const CallingScreen = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [callStatus, setCallStatus] = useState('Initializing...');
  const [localVideoStreamId, setLocalVideoStreamId] = useState('');
  const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { user, call: incomingCall, isIncomingCall } = route?.params;
  const voxImplant = Voximplant.getInstance();
  const call = useRef(incomingCall);
  const endpoint = useRef(null);

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const getPermissions = async () => {
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const recordAudioGranted =
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
      const cameraGranted =
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
      if (!recordAudioGranted && !cameraGranted) {
        Alert.alert('Permissions', 'Please grant permissions to use this app');
      } else {
        setPermissionsGranted(true);
      }
    };

    if (Platform.OS === 'android') {
      getPermissions();
    } else {
      setPermissionsGranted(true);
    }
  }, []);

  useEffect(() => {
    if (!permissionsGranted) {
      return;
    }

    const callSettings = {
      video: {
        sendVideo: true,
        receiveVideo: true,
      },
    };

    const makeCall = async () => {
      try {
        call.current = await voxImplant.call(user.user_name, callSettings);
        subscribeToCallEvents();
      } catch (e) {
        console.log(e);
        Alert.alert(`Error ${e.name}`, `Error code: ${e.code}`);
      }
    };

    const answerCall = async () => {
      try {
        await call.current.answer(callSettings);
        subscribeToCallEvents();
        endpoint.current = await call.current.getEndpoints()[0];
        subscribeToEndpointEvents();
      } catch (e) {
        console.log(e);
        Alert.alert(`Error ${e.name}`, `Error code: ${e.code}`);
      }
    };

    const subscribeToCallEvents = () => {
      call.current.on(Voximplant.CallEvents.Failed, (callEvent) => {
        showError(callEvent.reason);
      });
      call.current.on(Voximplant.CallEvents.ProgressToneStart, (callEvent) => {
        setCallStatus('Calling...');
      });
      call.current.on(Voximplant.CallEvents.Connected, (callEvent) => {
        setCallStatus('Connected');
      });
      call.current.on(Voximplant.CallEvents.Disconnected, (callEvent) => {
        setCallStatus('Disconnected');
        navigation.navigate('Contacts');
      });
      call.current.on(
        Voximplant.CallEvents.LocalVideoStreamAdded,
        (callEvent) => {
          setLocalVideoStreamId(callEvent.videoStream.id);
        }
      );
      call.current.on(Voximplant.CallEvents.EndpointAdded, (callEvent) => {
        endpoint.current = callEvent.endpoint;
        subscribeToEndpointEvents();
      });
    };

    const subscribeToEndpointEvents = async () => {
      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        (endpointEvent) => {
          setRemoteVideoStreamId(endpointEvent.videoStream.id);
        }
      );
    };

    const showError = (reason) => {
      Alert.alert('Call failed', `Reason: ${reason}`, [
        {
          text: 'OK',
          onPress: navigation.navigate('Contacts'),
        },
      ]);
    };

    if (isIncomingCall) {
      answerCall();
    } else {
      makeCall();
    }

    return () => {
      call.current.off(Voximplant.CallEvents.Failed);
      call.current.off(Voximplant.CallEvents.ProgressToneStart);
      call.current.off(Voximplant.CallEvents.Connected);
      call.current.off(Voximplant.CallEvents.Disconnected);
    };
  }, [permissionsGranted]);

  const onHangupPress = () => {
    call.current.hangup();
  };

  return (
    <View style={styles.page}>
      <Pressable onPress={goBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={30} color="white" />
      </Pressable>

      <Voximplant.VideoView
        style={styles.remoteVideo}
        videoStreamId={remoteVideoStreamId}
      />

      <Voximplant.VideoView
        style={styles.localVideo}
        videoStreamId={localVideoStreamId}
      />

      <View style={styles.cameraPreview}>
        <Text style={styles.name}>{user.user_display_name}</Text>
        <Text style={styles.phoneNumber}>{callStatus}</Text>
      </View>
      <CallToActionButtons onHangupPress={onHangupPress} />
    </View>
  );
};

export default CallingScreen;

const styles = StyleSheet.create({
  page: {
    height: '100%',
    backgroundColor: '#7b4e80',
  },
  cameraPreview: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  localVideo: {
    width: 100,
    height: 150,
    backgroundColor: '#fff',
    position: 'absolute',
    right: 20,
    top: 60,
    borderRadius: 10,
  },
  remoteVideo: {
    backgroundColor: '#7b4e80',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 100,
    borderRadius: 10,
  },
  name: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
    marginTop: 50,
    marginBottom: 10,
  },
  phoneNumber: {
    fontSize: 20,
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
  },
});
