import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FlixButton from '../Component/FlixButton';

export default ListAbsen = props => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const subscriber = getData();

    return () => subscriber();
  }, []);

  const getData = () => {
    return firestore()
      .collection('Absen')
      .doc('List')
      .collection(dayjs().format('DD-MM-YYYY'))
      .onSnapshot(querySnapshot => {
        const tempUsers = [];
        querySnapshot.forEach(documentSnapshot => {
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
    <FlixButton
      onPress={() => alert(JSON.stringify(item, null, 2))}
      style={{
        flex: 1,
        padding: 8,
        marginVertical: 0,
        backgroundColor: index % 2 === 0 ? '#CACACA' : '#FFFFFF',
      }}>
      <Text>Name: {item.name}</Text>
      <Text>
        {'Date: ' + dayjs(item.date).locale('id').format('DD MMMM YYYY hh:mm')}
      </Text>
      <Text>Address: {item.address}</Text>
    </FlixButton>
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
