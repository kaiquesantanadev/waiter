import React from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SubmitButton } from '../components/SubmitButton';
import colors from '../styles/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GerenteScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            navigation.replace('Login')
            AsyncStorage.removeItem('token')
          },
        },
      ]
    );
  };

  const goToUsuarios = () => {
    navigation.navigate('MenuADMUsuarios');
  };

  const goToProdutos = () => {
    Alert.alert('Produto', 'Navegar para gerenciamento de produtos');
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInDown" style={styles.titleContainer}>
        <Text style={styles.title}>Painel do Gerente</Text>
        <Text style={styles.subtitle}>Gerencie usuários e produtos</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={200} style={styles.menuContainer}>
        <SubmitButton label="Usuários" onPress={goToUsuarios} />  
        <SubmitButton label="Produto" onPress={goToProdutos} />
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={400} style={styles.logoutContainer}>
        <SubmitButton label="Sair" onPress={handleLogout} />
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'space-between',
  },
  titleContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.accent,
    fontSize: 16,
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 24,
    justifyContent: 'center',
    gap: 16,
  },
  logoutContainer: {
    marginBottom: 16,
  },
});

export default GerenteScreen;
