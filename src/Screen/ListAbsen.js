import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';

export default ListAbsen = props => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const subscriber = getData();

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const getData = () => {
    firestore()
      .collection('Absen')
      .doc('List')
      .collection(dayjs().format('DD-MM-YYY'))
      .onSnapshot(querySnapshot => {
        const tempUsers = [];
        querySnapshot.forEach(async documentSnapshot => {
          console.log('[ListAbsen] data', documentSnapshot.data());
          tempUsers.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setUsers(tempUsers);
        setLoading(false);
      });
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  const renderItem = ({item, index}) => (
    <View
      style={{
        flex: 1,
        padding: 8,
        backgroundColor: index % 2 == 0 ? '#CACACA' : '#FFFFFF',
      }}>
      <Text>Name: {item.name}</Text>
      <Text>
        {'Date: ' + dayjs(item.date).locale('id').format('DD MMMM YYYY hh:mm')}
      </Text>
      <Text>Address: {item.address}</Text>
      <Text>Metadata: {JSON.stringify(item.metadata, null, 2)}</Text>
    </View>
  );

  return (
    <View style={S.containerSafeAreaView}>
      <View style={S.containerView}>
        <FlatList
          data={users}
          ItemSeparatorComponent={() => (
            <View style={{borderWidth: 1 / 2, borderColor: '#CACACA'}} />
          )}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

const S = StyleSheet.create({
  containerSafeAreaView: {flex: 1},
  containerView: {flex: 1},
});
