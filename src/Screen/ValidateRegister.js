import React, {useContext, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FlixToast from '../Component/FlixToast';
import {findOne} from '../Helper.js/FirestoreHelper';
import {AuthContext} from '../Provider/AuthProvider';

export default ValidateLogin = props => {
  const {register} = useContext(AuthContext);
  var docDetail = useRef(null);

  const [name, setName] = useState('');
  const [isProcess, setIsProcess] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onCheckName = async () => {
    setIsProcess(true);
    const dataUsers = await findOne('Users', {
      key: 'Name',
      comparation: '==',
      value: name,
    });
    if (dataUsers.size === 1) {
      const isEmailExist = dataUsers?.email;
      if (isEmailExist) {
        setIsProcess(false);
        return FlixToast.show(
          'Nama ini sudah dikaitkan dengan email: ' + isEmailExist,
          {status: 'warning'},
        );
      }
      dataUsers.forEach(doc => (docDetail.current = doc));
      setIsProcess(false);
      setShowRegister(true);
    } else {
      Alert.alert('Perhatian', 'Nama tidak ditemukan');
      setIsProcess(false);
    }
  };

  const onPressLanjutValidasi = async () => {
    console.log('[ValidateRegister] docdetail', docDetail.current);
    if (!email || !password) {
      alert('Masukkan Email & Password');
    } else {
      await register(email, password, docDetail.current);
      FlixToast.show('Cek email anda dan lakukan verifikasi', {
        status: 'info',
        type: 'snackbar',
      });
      props.navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={S.containerSafeAreaView}>
      <View style={S.containerView}>
        <TextInput
          value={name}
          onChangeText={setName}
          editable={isProcess === false && showRegister === false}
          placeholder="Masukkan nama Anda untuk validasi"
          placeholderTextColor={'#aaa'}
          style={{
            backgroundColor: showRegister === true ? '#D3D3D3' : 'white',
            padding: 10,
            borderWidth: 1,
            borderColor: '#CACACA',
            borderRadius: 5,
            marginVertical: 14,
          }}
        />
        {showRegister ? (
          <View style={{borderTopWidth: 2, borderTopColor: '#CACACA'}}>
            <Text
              style={{textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>
              Kaitkan akun dengan nama: {name}
            </Text>
            <TextInput
              value={email}
              autoCapitalize="none"
              autoComplete="email"
              onChangeText={setEmail}
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
              autoCapitalize="none"
              onChangeText={setPassword}
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
            <Button title="Lanjutkan" onPress={() => onPressLanjutValidasi()} />
          </View>
        ) : isProcess ? (
          <ActivityIndicator
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 24,
            }}
          />
        ) : (
          <Button title="Cek Nama" onPress={() => onCheckName()} />
        )}
      </View>
    </SafeAreaView>
  );
};

const S = StyleSheet.create({
  containerSafeAreaView: {flex: 1},
  containerView: {flex: 1, justifyContent: 'center', padding: 24},
});
