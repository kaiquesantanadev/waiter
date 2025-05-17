import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import GarcomScreen from '../screens/GarcomScreen';
import CozinheiroScreen from '../screens/CozinheiroScreen';
import GerenteScreen from '../screens/GerenteScreen';
import MenuUsuariosScreen from '../screens/MenuUsuariosScreen';
import MenuCriarUsuariosScreen from '../screens/ADMUsuario/MenuCriarUsuariosScreen';
import MenuExcluirUsuariosScreen from '../screens/ADMUsuario/MenuExcluirUsuarios';
import MenuProdutosScreen from '../screens/MenuProdutosScreen';
import MenuExcluirProdutosScreen from '../screens/ADMProduto/MenuExcluirProdutos';

export type RootStackParamList = {
  Login: undefined;
  Garcom: undefined;
  Cozinheiro: undefined;
  Gerente: undefined;
  MenuADMUsuarios: undefined; 
  MenuADMProdutos: undefined;
  MenuCriarUsuarios: undefined;
  MenuExcluirUsuarios: undefined;
  MenuExcluirProdutos: undefined
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
        <Stack.Screen name="MenuADMProdutos" component={MenuProdutosScreen} />
        <Stack.Screen name="MenuCriarUsuarios" component={MenuCriarUsuariosScreen} />
        <Stack.Screen name="MenuExcluirUsuarios" component={MenuExcluirUsuariosScreen} />
        <Stack.Screen name="MenuExcluirProdutos" component={MenuExcluirProdutosScreen} />
      </Stack.Navigator>
  );
}
