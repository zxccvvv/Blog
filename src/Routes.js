import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from './Provider/AuthProvider';
import Absen from './Screen/Absen';
import ListAbsen from './Screen/ListAbsen';
import Login from './Screen/Login';
import ValidateRegister from './Screen/ValidateRegister';

function StackHome() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Absen" component={Absen} />
      <Stack.Screen name="ListAbsen" component={ListAbsen} />
    </Stack.Navigator>
  );
}

function StackLogin() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{title: 'Login'}} />
      <Stack.Screen
        name="ValidateRegister"
        component={ValidateRegister}
        options={{title: 'Validasi'}}
      />
    </Stack.Navigator>
  );
}

export default Routes = () => {
  const [initializing, setInitializing] = useState(true);
  const [isLoginValid, setIsLoginValid] = useState(false);
  const {setUser} = useContext(AuthContext);

  // Handle user state changes
  async function onAuthStateChanged(userDetail) {
    console.log('[Routes] userdetail', JSON.stringify(userDetail, null, 2));
    setIsLoginValid(userDetail?.emailVerified);
    if (!userDetail?.emailVerified) {
      userDetail?.reload();
    } else {
      const result = await firestore()
        .collection('UsersLogin')
        .doc(userDetail.uid)
        .get();
      const setDataUser = {
        uid: userDetail.uid,
        ...result.data(),
      };
      console.log('[Routes] setDataUser', setDataUser);
      setUser(setDataUser);
    }
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => {
      subscriber();
    };
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      {isLoginValid ? <StackHome /> : <StackLogin />}
    </NavigationContainer>
  );
};
