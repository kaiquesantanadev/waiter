import React, { useEffect, useRef, useState } from 'react';
import {
  View, StyleSheet, Text, FlatList, Alert, TouchableOpacity, Image
} from 'react-native';
import { Input } from '../../components/Input';
import { SubmitButton } from '../../components/SubmitButton';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../config/api';
import ProductCard from '../../components/ProductCard';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  linkImagem: string;
  tipoProduto: {
    id: number;
    nome: string;
  };
}

const MenuExcluirProdutosScreen: React.FC = () => {
  const [nome, setNome] = useState('');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const navigation = useNavigation();

  const goBack = () => navigation.goBack();

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);


  const fetchProdutos = async () => {
    let responseData: any = null;
    let filtrados: Produto[] = [];


    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`http://${BASE_URL}/produto/status?statusGeral=ATIVO&size=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      responseData = response.data;
      const todosProdutos: Produto[] = responseData.content;

      filtrados = todosProdutos.filter((produto) =>
        produto.nome.toLowerCase().includes(nome.toLowerCase())
      );

      setProdutos(filtrados);
    } catch (error: unknown) {
      const debugData = JSON.stringify(filtrados, null, 2);

      if (axios.isAxiosError(error)) {
        Alert.alert(
          'Erro ao buscar produtos',
          error.response?.data?.message || `Erro desconhecido.\nDebug: ${debugData}`
        );
      } else {
        Alert.alert(
          'Erro ao buscar produtos',
          (error as Error).message || `Erro desconhecido.\nDebug: ${debugData}`
        );
      }
    }
  };

  const handleDelete = async (produtoId: number) => {
    console.log('testeDelete')
    Alert.alert('Confirmar exclusão', 'Deseja realmente excluir este produto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`http://${BASE_URL}/produto/${produtoId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert('Sucesso', 'Produto excluído com sucesso!');
            setProdutos(prev => prev.filter(produto => produto.id !== produtoId));
          } catch (error: unknown) {
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
        <Text style={styles.title}>Excluir Produto</Text>
        <Text style={styles.subtitle}>Pesquise pelo nome</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
        <Input
          label="Digite o nome do produto"
          value={nome}
          onChangeText={setNome}
        />
        <SubmitButton label="Pesquisar" onPress={fetchProdutos} />
      </Animatable.View>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <ProductCard
            nome={item.nome}
            descricao={item.descricao}
            preco={item.preco}
            tipo={item.tipoProduto?.nome || 'N/A'}
            imagem={item.linkImagem}
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
  card: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  descricao: {
    fontSize: 12,
    color: colors.white,
    marginVertical: 4,
  },
  preco: {
    fontSize: 14,
    color: colors.accent,
  },
  tipo: {
    fontSize: 12,
    color: colors.white,
    marginTop: 4,
  },
});

export default MenuExcluirProdutosScreen;
