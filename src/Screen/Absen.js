import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {BarcodeFormat, useScanBarcodes} from 'vision-camera-code-scanner';
import FlixButton from '../Component/FlixButton';
import FlixToast from '../Component/FlixToast';
import {AuthContext} from '../Provider/AuthProvider';

export default Absen = props => {
  const {logout} = useContext(AuthContext);
  const {user} = useContext(AuthContext);
  const [showCamera, setShowCamera] = useState(false);
  const [barcodeDetected, setBarcodeDetected] = useState(false);
  const isFocus = useIsFocused();

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
              .collection(dayjs().format('DD-MM-YYYY'))
              .doc(user.uid)
              .set({
                name: user.Name,
                date: dayjs().valueOf(),
                address: detailAddress?.title,
                metadata: detailAddress?.address,
              })
              .then(() => {
                setBarcodeDetected(null);
                setShowCamera(false);
                FlixToast.show('Data berhasil disimpan', {status: 'success'});
              })
              .catch(e => {
                FlixToast.show('Something went wrong', {status: 'danger'});
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
    const getDocID = await firestore()
      .collection('Absen')
      .doc('list')
      .collection(dayjs().format('DD-MM-YYYY'))
      .doc(user.uid)
      .get();
    if (getDocID.id === user.uid) {
      return FlixToast.show('Kamu sudah melakukan scan hari ini', {
        status: 'info',
      });
    }
    setBarcodeDetected(false);
    setShowCamera(true);
  };

  return (
    <View style={S.containerSafeAreaView}>
      <View style={S.containerView}>
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
            color: '#0056A1',
            fontWeight: 'bold',
            padding: 14,
            borderRadius: 8,
          }}>
          Selamat Datang, {user?.Name}
        </Text>
        {barcodeDetected ? (
          <ActivityIndicator
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          />
        ) : devices != null && hasPermission && showCamera ? (
          <>
            <Camera
              style={{flex: 1, marginVertical: 14}}
              device={devices}
              isActive={!barcodeDetected || isFocus}
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
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        {user.isAdmin && (
          <FlixButton
            style={{flex: 1, marginHorizontal: 4}}
            label="Show Records"
            onPress={() => props.navigation.navigate('ListAbsen')}
          />
        )}
        <FlixButton
          style={{flex: 1, marginHorizontal: 4}}
          label="Logout"
          onPress={() =>
            Alert.alert('Info', 'Yakin ingin keluar?', [
              {text: 'Tidak'},
              {text: 'Ya', onPress: () => logout()},
            ])
          }
        />
      </View>
    </View>
  );
};

const S = StyleSheet.create({
  containerSafeAreaView: {flex: 1, padding: 14},
  containerView: {flex: 1},
});
