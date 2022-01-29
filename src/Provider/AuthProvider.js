import auth from '@react-native-firebase/auth';
import React, {createContext, useState} from 'react';
import FlixToast from '../Component/FlixToast';
import {FirestoreTimestamp, update} from '../Helper.js/FirestoreHelper';

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      !userCredential?.user?.emailVerified &&
        FlixToast.show('Email belum terverifikasi, silahkan cek email anda', {
          status: 'danger',
          type: 'snackbar',
          label: 'Resent Link Verification',
          duration: 1500,
          onPress: () => userCredential.user.sendEmailVerificatio(),
        });
      !userCredential?.user?.emailVerified && (await logout());
    } catch (e) {
      console.log(e);
      FlixToast.show(e.code, {status: 'danger', type: 'snackbar'});
    }
  };

  const logout = async () => {
    try {
      await auth().signOut();
    } catch (e) {
      console.error(e);
    }
  };

  const register = async (email, password, docDetail) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      userCredential.user.sendEmailVerification();
      await update('Users', docDetail.id, {
        email,
        createdAt: FirestoreTimestamp,
        uid: userCredential.user.uid,
      });
      await logout();
    } catch (e) {
      console.log('[AuthProvider] JSON.stringify(e);', JSON.stringify(e.code));
      if (e.code === 'auth/email-already-in-use') {
        alert('Email address is already in use!');
      }
      if (e.code === 'auth/invalid-email') {
        alert('Email address is invalid!');
      }
      if (e.code === 'auth/weak-password') {
        alert('The password is too weak!');
      }
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
