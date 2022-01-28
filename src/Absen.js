import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {BarcodeFormat, useScanBarcodes} from 'vision-camera-code-scanner';
import dayjs from 'dayjs';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export default App = () => {
  const [name, setName] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [barcodeDetected, setBarcodeDetected] = useState(false);

  const [hasPermission, setHasPermission] = React.useState(false);
  const [hasLocationPermission, setHasLocationPermission] =
    React.useState(false);
  const devices = useCameraDevices().back;
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

  React.useEffect(() => {
    handlePermission();
  }, []);

  const handlePermission = async () => {
    const status = await Camera.requestCameraPermission();
    setHasPermission(status === 'authorized');
    const statusLocation = await request(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
    setHasLocationPermission(statusLocation === RESULTS.GRANTED);
  };

  useEffect(() => {
    console.log('[App] barcodes', barcodes);
    if (barcodes.length !== 0 && barcodeDetected === false) {
      setBarcodeDetected(true);
      const validateQRValue = barcodes.find(
        x =>
          x.displayValue ===
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR0JJIFBhc2FyIEJhcnUifQ.ckKz-bMziR8eMc8EEb4Gpc2oWJspm9lX4Gvt-B5dZLE',
      );
      if (!validateQRValue) {
        return Alert.alert('Caution', 'QR Code is not valid!', [
          {
            text: 'OK',
            onPress: () => {
              setBarcodeDetected(null);
              setShowCamera(false);
            },
          },
        ]);
      }
      if (hasLocationPermission) {
        Geolocation.getCurrentPosition(
          async position => {
            const detailAddress = await LatLongToAddress(
              position.coords.latitude,
              position.coords.longitude,
            );
            firestore()
              .collection('Absen')
              .doc('List')
              .collection(dayjs().format('DD-MM-YYY'))
              .add({
                name,
                date: dayjs().valueOf(),
                address: detailAddress?.title,
                metadata: detailAddress?.address,
              })
              .then(() => {
                setBarcodeDetected(null);
                setShowCamera(false);
              });
          },
          error => {
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    }
  }, [barcodeDetected, barcodes]);

  const LatLongToAddress = async (lat, long) => {
    try {
      const response = await fetch(
        'https://revgeocode.search.hereapi.com/v1/revgeocode?at=' +
          lat +
          '%2C' +
          long +
          '&lang=id-ID&apiKey=dY_ekuhddZb-Yz0knG3G39rwOIPZVuyTBVcgyaNnNqM',
      );
      const json = await response.json();
      return json.items[0];
    } catch (error) {
      console.error(error);
    }
  };

  const onPressCamera = async () => {
    const dataUsers = await firestore()
      .collection('Users')
      .where('Name', '==', name)
      .get();
    console.log('[Absen] dataUsers', dataUsers.size);
    if (name && dataUsers) {
      setBarcodeDetected(false);
      setShowCamera(true);
    } else {
      if (!dataUsers) {
        alert('Nama tidak ditemukan');
      } else {
        alert('Masukkan Nama');
      }
    }
  };

  return (
    <View style={S.containerSafeAreaView}>
      <View style={S.containerView}>
        <TextInput value={name} placeholder="Nama" onChangeText={setName} />
        {barcodeDetected ? (
          <ActivityIndicator
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          />
        ) : devices != null && hasPermission && showCamera ? (
          <>
            <Camera
              style={{flex: 1}}
              device={devices}
              isActive={!barcodeDetected}
              frameProcessor={frameProcessor}
              frameProcessorFps={2}
            />
            {barcodes.map((barcode, idx) => (
              <Text key={idx} style={{fontSize: 20, fontWeight: 'bold'}}>
                {barcode.displayValue}
                aaa
              </Text>
            ))}
          </>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Button title="Scan disini" onPress={() => onPressCamera()} />
          </View>
        )}
      </View>
    </View>
  );
};

const S = StyleSheet.create({
  containerSafeAreaView: {flex: 1},
  containerView: {flex: 1, padding: 14},
});
