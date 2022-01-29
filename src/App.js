import React from 'react';
import FlixToast from './Component/FlixToast';
import {AuthProvider} from './Provider/AuthProvider';
import Routes from './Routes';

export default App = props => {
  return (
    <AuthProvider>
      <Routes />
      <FlixToast />
    </AuthProvider>
  );
};
