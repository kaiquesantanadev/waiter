import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Input } from '../../components/Input';
import { SubmitButton } from '../../components/SubmitButton';
import colors from '../../styles/colors';
import { saveToken } from '../../utils/auth';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';  // Corrigido aqui para Picker do pacote correto
import Icon from 'react-native-vector-icons/Ionicons'; // Ícone para a seta
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../config/api';


type UserData = {
  email: string;
  senha: string;
  funcionario: {
    nome: string;
    cpf: string;
    cargoFuncionario: string;
  };
};


const CriarUsuarioScreen: React.FC = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  const clearData = () => {
    setEmail('')
    setSenha('')
    setNome('')
    setCpf('')
    setCargoFuncionario('COZINHEIRO')
  }

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cargoFuncionario, setCargoFuncionario] = useState('COZINHEIRO');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !senha || !nome || !cpf) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    const userData: UserData = {
      email,
      senha,
      funcionario: {
        nome,
        cpf,
        cargoFuncionario,
      },
    };

try {
  setLoading(true);

  // Obter token do AsyncStorage
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    Alert.alert('Erro', 'Token não encontrado.');
    return;
  }

  // Realizar a requisição para criar o usuário
  const response = await axios.post(
    `http://${BASE_URL}/login`,
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Exibir resposta do backend em caso de sucesso
  if (response.status === 201) {
    Alert.alert('Sucesso', response.data.message || 'Usuário criado com sucesso!');
    clearData()
  } else {
    Alert.alert('Erro', 'Ocorreu um erro ao tentar criar o usuário.');
  }
} catch (error: any) {
  // Quando o erro for texto puro
  const errorMessage = error.response?.data || error.message || 'Erro desconhecido';
  Alert.alert('Erro', errorMessage);  // Exibe o texto puro da resposta de erro
} finally {
  setLoading(false);
}


  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={30} color={colors.white} />
      </TouchableOpacity>

      <Animatable.View animation="fadeInDown" style={styles.titleContainer}>
        <Text style={styles.title}>Criar Novo Usuário</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={200} style={styles.formContainer}>
        <Input label="Nome" value={nome} onChangeText={setNome} />
        <Input label="E-mail" value={email} onChangeText={setEmail} />
        <Input label="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
        <Input label="CPF" value={cpf} onChangeText={setCpf} />

        <Text style={styles.label}>Cargo</Text>
        <Picker
          selectedValue={cargoFuncionario}
          onValueChange={(itemValue: string) => setCargoFuncionario(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Cozinheiro" value="COZINHEIRO" />
          <Picker.Item label="Garçom" value="GARCON" />
          <Picker.Item label="Gerente" value="GERENTE" />
        </Picker>

        <SubmitButton label="Criar Usuário" onPress={handleSubmit} loading={loading} />
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 24,
  },
  label: {
    color: colors.white,
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    height: 50,  // Ajustando altura para evitar corte
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.white,  // Garantindo fundo branco
    marginBottom: 16,
    paddingHorizontal: 10, // Ajustando o preenchimento
  },
});

export default CriarUsuarioScreen;
