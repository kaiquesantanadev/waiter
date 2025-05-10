import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Input } from '../components/Input';
import { SubmitButton } from '../components/SubmitButton';
import { loginUser } from '../services/authService';
import colors from '../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { saveToken, decodeToken } from '../utils/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export const LoginScreen: React.FC = () => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    try {
      const response = await loginUser({ login, senha });
      const token = response.data.token;

      await saveToken(token);
      const decoded = decodeToken(token);

      console.log('Payload decodificado:', decoded);

      switch (decoded.cargo) {
        case 1:
          navigation.navigate('Cozinheiro');
          break;
        case 2:
          navigation.navigate('Garcom');
          break;
        case 3:
          navigation.navigate('Gerente');
          break;
        default:
          Alert.alert('Erro', 'Cargo inválido no token');
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);

      if (error.response) {
        const status = error.response.status;
        let errorMessage = '';

        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }

        Alert.alert('Erro no login', `Status: ${status}\nMensagem: ${errorMessage}`);
      } else if (error.request) {
        Alert.alert('Erro de rede', 'Não foi possível conectar ao servidor.');
      } else {
        Alert.alert('Erro inesperado', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInDown" style={styles.titleContainer}>
        <Text style={styles.title}>Bem-vindo ao Waiter</Text>
        <Text style={styles.subtitle}>O aplicativo oficial do nosso restaurante!</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
        <Input label="E-mail" value={login} onChangeText={setLogin} />
        <Input label="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
        <SubmitButton label="Entrar" onPress={handleLogin} />
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.accent,
    fontSize: 16,
  },
  form: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 24,
  },
  register: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
