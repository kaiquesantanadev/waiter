import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import GarcomScreen from '../screens/GarcomScreen';
import CozinheiroScreen from '../screens/CozinheiroScreen';
import GerenteScreen from '../screens/GerenteScreen';
import MenuUsuariosScreen from '../screens/MenuUsuariosScreen';
import MenuCriarUsuariosScreen from '../screens/ADMUsuario/MenuCriarUsuariosScreen';

export type RootStackParamList = {
  Login: undefined;
  Garcom: undefined;
  Cozinheiro: undefined;
  Gerente: undefined;
  MenuADMUsuarios: undefined; 
  MenuCriarUsuarios: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Garcom" component={GarcomScreen} />
        <Stack.Screen name="Cozinheiro" component={CozinheiroScreen} />
        <Stack.Screen name="Gerente" component={GerenteScreen} />
        <Stack.Screen name="MenuADMUsuarios" component={MenuUsuariosScreen} />
        <Stack.Screen name="MenuCriarUsuarios" component={MenuCriarUsuariosScreen} />
      </Stack.Navigator>
  );
}
