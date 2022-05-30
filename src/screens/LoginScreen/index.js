import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Voximplant } from 'react-native-voximplant';
import { ACC_NAME, APP_NAME } from '../../Constants';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const clientConfig = {};
  const voxImplant = Voximplant.getInstance(clientConfig);
  const navigation = useNavigation();

  useEffect(() => {
    const connect = async () => {
      const status = await voxImplant.getClientState();
      if (status === Voximplant.ClientState.DISCONNECTED) {
        await voxImplant.connect();
      } else if (status === Voximplant.ClientState.LOGGED_IN) {
        redirectHome();
      }
    };

    connect();
  }, []);

  const signIn = async () => {
    try {
      // fully-qualified username and password format required for Voximplant
      const fqUsername = `${username}@${APP_NAME}.${ACC_NAME}.voximplant.com`;
      await voxImplant.login(fqUsername, password);
      redirectHome();
    } catch (e) {
      console.log(e);
      Alert.alert(`Error ${e.name}`, `Error code: ${e.code}`);
    }
  };

  const redirectHome = () => {
    // Reset the navigation so the user can't go back to the previous screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Contacts' }],
    });
  };

  return (
    <View style={styles.page}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={signIn}>
        <Text style={styles.textColor}>Sign in</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#2e7bff',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
  },
  textColor: {
    color: '#fff',
    fontWeight: '700',
  },
});
