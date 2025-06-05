import React, { useEffect, useRef, useState } from 'react';
import {
  View, StyleSheet, Text, FlatList, Alert, TouchableOpacity
} from 'react-native';
import { Input } from '../../components/Input';
import { SubmitButton } from '../../components/SubmitButton';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../styles/colors';
import { UserCard } from '../../components/UserCard';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../config/api';

interface Usuario {
  id: number;
  email: string;
  funcionario: {
    id: number;
    nome: string;
    cpf: string;
    cargoFuncionario: {
      cargo: string;
    };
  };
}

const MenuExcluirUsuariosScreen: React.FC = () => {
  const [nome, setNome] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const navigation = useNavigation();

  const goBack = () => navigation.goBack();

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false; 
    };
  }, []);


const fetchUsuarios = async () => {
   console.log('a')
  let responseData: any = null;
  let filtrados: Usuario[] = [];

  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`http://${BASE_URL}/login/status?size=100&statusFuncionario=ativo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('oi')    
    responseData = response.data;

    console.log('Resposta da API:', JSON.stringify(responseData, null, 2));

    const todosUsuarios: Usuario[] = responseData.content;

    filtrados = todosUsuarios.filter((usuario) =>
      usuario.funcionario?.nome?.toLowerCase().includes(nome.toLowerCase())
    );

    setUsuarios(filtrados);
  } catch (error: unknown) {
    const debugData = JSON.stringify(filtrados, null, 2);

    if (axios.isAxiosError(error)) {
      Alert.alert(
        'Erro ao buscar usuários',
        error.response?.data?.message || `Erro desconhecido.\nDebug: ${debugData}`
      );
    } else {
      Alert.alert(
        'Erro ao buscar usuários',
        (error as Error).message || `Erro desconhecido.\nDebug: ${debugData}`
      );
    }
  }
};


const handleDelete = async (funcionarioId: number) => {
  Alert.alert('Confirmar exclusão', 'Deseja realmente excluir este usuário?', [
    { text: 'Cancelar', style: 'cancel' },
    {
      text: 'Excluir',
      style: 'destructive',
      onPress: async () => {
        try {
          console.log('ID do funcionário:', funcionarioId);
          const token = await AsyncStorage.getItem('token');
          console.log('Token:', token);

          await axios.delete(`http://${BASE_URL}/login/${funcionarioId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          Alert.alert('Sucesso', 'Usuário excluído com sucesso!');
          setUsuarios(prev =>
            prev.filter(usuario => usuario.id !== funcionarioId)
          );
        } catch (error: unknown) {
          console.log('Erro completo:', error);

          if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.message;
            const rawData = JSON.stringify(error.response?.data, null, 2);

            Alert.alert(
              'Erro ao excluir',
              `Status: ${status}\nMensagem: ${message || 'Mensagem ausente'}\nDetalhes: ${rawData}`
            );
          } else {
            Alert.alert(
              'Erro ao excluir',
              (error as Error).message || 'Erro desconhecido'
            );
          }
        }
      },
    },
  ]);
};
    
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Icon name="arrow-back-circle-sharp" size={28} color={colors.white} />
      </TouchableOpacity>

      <Animatable.View animation="fadeInDown" style={styles.header}>
        <Text style={styles.title}>Excluir Usuário</Text>
        <Text style={styles.subtitle}>Pesquise pelo nome</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
        <Input
          label="Digite o nome"
          value={nome}
          onChangeText={setNome}
        />
        <SubmitButton label="Pesquisar" onPress={fetchUsuarios} />
      </Animatable.View>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <UserCard
            nome={item.funcionario.nome}
            email={item.email}
            cpf={item.funcionario.cpf}
            cargo={item.funcionario.cargoFuncionario.cargo}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    marginTop: 24,
    marginLeft: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: colors.accent,
    marginTop: 4,
  },
  form: {
    backgroundColor: colors.secondary,
    padding: 24,
    borderRadius: 12,
    marginHorizontal: 16,
  },
});

export default MenuExcluirUsuariosScreen;
