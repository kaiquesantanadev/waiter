import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SubmitButton } from '../components/SubmitButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../styles/colors';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MenuUsuariosScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const goBack = () => {
    navigation.goBack();
  };

  const handleCriar = () => {
    navigation.navigate('MenuCriarUsuarios');
  };

  const handleAtualizar = () => {
    Alert.alert('Navegar para atualizar usuário');
  };

  const handleExcluir = () => {
    navigation.navigate('MenuExcluirUsuarios');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Icon name="arrow-back-circle-sharp" size={28} color={colors.white} />
      </TouchableOpacity>

      <Animatable.View animation="fadeInDown" style={styles.titleContainer}>
        <Text style={styles.title}>Gerenciar Usuários</Text>
        <Text style={styles.subtitle}>Escolha uma opção</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={200} style={styles.menuContainer}>
        <SubmitButton label="Criar Usuário" onPress={handleCriar} />
        <SubmitButton label="Atualizar Usuário" onPress={handleAtualizar} />
        <SubmitButton label="Excluir Usuário" onPress={handleExcluir} />
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24
  },
  backButton: {
    marginTop: 24,
    marginBottom: 12,
    width: 32,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
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
    gap: 16,
  },
});

export default MenuUsuariosScreen;
