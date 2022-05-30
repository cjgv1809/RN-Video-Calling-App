import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import dummyContacts from '../../../assets/data/contacts.json';
import { Voximplant } from 'react-native-voximplant';

const ContactsScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(dummyContacts);
  const navigation = useNavigation();
  const voxImplant = Voximplant.getInstance();

  useEffect(() => {
    voxImplant.on(Voximplant.ClientEvents.IncomingCall, (incomingCallEvent) => {
      navigation.navigate('IncomingCall', { call: incomingCallEvent.call });
    });

    return () => {
      voxImplant.off(Voximplant.ClientEvents.IncomingCall);
    };
  }, []);

  useEffect(() => {
    const newContacts = dummyContacts.filter((contact) =>
      contact.user_display_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(newContacts);
  }, [searchTerm]);

  const callUser = (user) => {
    navigation.navigate('Calling', { user });
  };

  return (
    <View style={styles.page}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <FlatList
        keyExtractor={(item) => item.user_id}
        data={filteredContacts}
        renderItem={({ item }) => (
          <Pressable onPress={() => callUser(item)}>
            <Text style={styles.contactName}>{item.user_display_name}</Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default ContactsScreen;

const styles = StyleSheet.create({
  page: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    marginVertical: 10,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  searchInput: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
  },
});
