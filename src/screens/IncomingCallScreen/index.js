import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import bg from '../../../assets/images/ios_bg.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Voximplant } from 'react-native-voximplant';

const IncomingCallScreen = () => {
  const [caller, setCaller] = useState('');
  const route = useRoute();
  const { call } = route?.params;
  const navigation = useNavigation();

  useEffect(() => {
    setCaller(call.getEndpoints()[0].displayName);

    call.on(Voximplant.CallEvents.Disconnected, (callEvent) => {
      navigation.navigate('Home');
    });

    return () => {
      call.off(Voximplant.CallEvents.Disconnected);
    };
  }, []);

  const onDecline = () => {
    call.decline();
  };

  const onAccept = () => {
    navigation.navigate('Calling', {
      call,
      isIncomingCall: true,
    });
  };

  return (
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <Text style={styles.name}>{caller}</Text>
      <Text style={styles.phoneNumber}>WhatsApp Video...</Text>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Ionicons name="alarm" size={30} color="white" />
          <Text style={styles.iconText}>Remind me</Text>
        </View>
        <View style={styles.iconContainer}>
          <Entypo name="message" size={30} color="white" />
          <Text style={styles.iconText}>Message</Text>
        </View>
      </View>

      <View style={styles.row}>
        {/* Decline Button */}
        <Pressable onPress={onDecline} style={styles.iconContainer}>
          <View style={styles.iconButtonContainer}>
            <Feather name="x" size={50} color="white" />
          </View>
          <Text style={styles.iconText}>Decline</Text>
        </Pressable>

        {/* Accept Button */}
        <Pressable onPress={onAccept} style={styles.iconContainer}>
          <View
            style={[styles.iconButtonContainer, { backgroundColor: '#2e7bff' }]}
          >
            <Feather name="check" size={50} color="white" />
          </View>
          <Text style={styles.iconText}>Accept</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

export default IncomingCallScreen;

const styles = StyleSheet.create({
  bg: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 'auto',
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  iconText: {
    color: '#fff',
  },
  iconButtonContainer: {
    backgroundColor: 'red',
    padding: 10,
    marginBottom: 10,
    borderRadius: 50,
  },
});
