import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Absen from './Absen';
import ListAbsen from './ListAbsen';

export default App = props => {
  const [screen, setScreen] = useState('Absen');
  /**
   * List function to handling component
   */

  /**
   * List function to render component
   */

  /**
   * End list function to render component
   */

  return (
    <View style={S.containerSafeAreaView}>
      <View style={{flexDirection: 'row'}}>
        {['Absen', 'List'].map(el => (
          <TouchableOpacity
            key={el}
            onPress={() => setScreen(el)}
            style={{
              flex: 1,
              backgroundColor: '#a0456a',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 14,
              borderColor: el === screen ? '#502235' : 'transparent',
              borderWidth: 1,
            }}>
            <Text
              style={{
                fontSize: 20,
                color: 'white',
                fontWeight: el === screen ? 'bold' : 'normal',
              }}>
              {el}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {screen === 'Absen' ? <Absen /> : <ListAbsen />}
    </View>
  );
};

const S = StyleSheet.create({
  containerSafeAreaView: {flex: 1},
  containerView: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
