import firestore from '@react-native-firebase/firestore';
import React, {useContext, useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContext} from '../Provider/AuthProvider';

export default Login = props => {
  const {login} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onPressLogin = async () => {
    const emailFound = await firestore()
      .collection('Users')
      .where('email', '==', email)
      .get();
    if (emailFound.size !== 0) {
      login(email, password);
    }
  };

  return (
    <SafeAreaView style={S.containerSafeAreaView}>
      <View style={S.containerView}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          placeholder="Masukkan alamat email"
          keyboardType="email-address"
          placeholderTextColor={'#aaa'}
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: '#CACACA',
            borderRadius: 5,
            marginVertical: 14,
          }}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          placeholder="Masukkan password"
          secureTextEntry
          placeholderTextColor={'#aaa'}
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: '#CACACA',
            borderRadius: 5,
            marginVertical: 14,
          }}
        />
        <Button title="Login" onPress={() => login(email, password)} />
        <Text
          onPress={() => props.navigation.navigate('ValidateRegister')}
          style={{
            marginTop: 14,
            color: 'blue',
            textDecorationLine: 'underline',
            fontSize: 16,
            fontWeight: '600',
          }}>
          atau Validasi nama untuk membuat email dan password
        </Text>
      </View>
    </SafeAreaView>
  );
};

const S = StyleSheet.create({
  containerSafeAreaView: {flex: 1},
  containerView: {flex: 1, padding: 24, justifyContent: 'center'},
});
