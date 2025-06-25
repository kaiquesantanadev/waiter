import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

import colors from '../../styles/colors';
import { SubmitButton } from '../../components/SubmitButton';
import { BASE_URL } from '../../config/api';


const statusOptions = ['A_FAZER', 'FAZENDO'];

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

interface ControleStatusItemPedido {
  id: number;
  status: {
    id: number;
    status: string;
    descricao: string;
  };
}

interface ItemPedido {
  id: number;
  observacao: string;
  produto: Produto;
  controleStatusItemPedidoDtoDetalhar: ControleStatusItemPedido;
}

interface PedidoCardProps {
  item: ItemPedido;
  onUpdate: () => void;
}

const PedidoCard: React.FC<PedidoCardProps> = ({ item, onUpdate }) => {
  const nomeProduto = item.produto?.nome;
  const observacao = item.observacao || 'Sem observações';
  const statusAtual = item.controleStatusItemPedidoDtoDetalhar?.status?.descricao;

  return (
    <View style={styles.card}>
      <Text style={styles.nome}>{nomeProduto}</Text>
      <Text style={styles.observacao}>Observação: {observacao}</Text>
      <Text style={styles.status}>Status: {statusAtual}</Text>
      <SubmitButton label="Atualizar" onPress={onUpdate} />
    </View>
  );
};

const GerenciarPedidosScreen: React.FC = () => {
  const [statusSelecionado, setStatusSelecionado] = useState<'A_FAZER' | 'FAZENDO'>('A_FAZER');
  const [pedidos, setPedidos] = useState<ItemPedido[]>([]);

  const fetchPedidos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`http://${BASE_URL}/pedido/status`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          statusProcesso: statusSelecionado,
          size: 50,
        },
      });
      console.log('Resposta da API de pedidos:', response.data);
      const pedidosComItens = response.data?.content || [];
      const todosItens: ItemPedido[] = pedidosComItens.flatMap((pedido: any) =>
        (pedido.itensPedido || []).filter(
          (item: any) =>
            item.controleStatusItemPedidoDtoDetalhar?.status?.descricao
              ?.toUpperCase()
              ?.replace(/\s/g, '_') === statusSelecionado
        )
      );
      setPedidos(todosItens);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      Alert.alert('Erro', 'Erro ao buscar pedidos.');
    }
  };

  const handleUpdate = async (idStatusControle: number, statusAtual: string) => {
    const proximoStatus = statusAtual === 'A Fazer' ? 'FAZENDO' : 'PRONTO';
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `http://${BASE_URL}/controle-status-item-pedido/${idStatusControle}`,
        { descricao: 'teste', status: proximoStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Sucesso', 'Status atualizado com sucesso!');
      fetchPedidos();
    } catch (error: any) {
      Alert.alert('Erro', error);
      console.log(error)
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [statusSelecionado]);

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInDown" style={styles.header}>
        <Text style={styles.title}>Gerenciar Pedidos</Text>
      </Animatable.View>

      <View style={styles.filterContainer}>
        {statusOptions.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              statusSelecionado === status && styles.filterButtonActive,
            ]}
            onPress={() => setStatusSelecionado(status as 'A_FAZER' | 'FAZENDO')}>
            <Text
              style={
                statusSelecionado === status
                  ? styles.filterButtonTextActive
                  : styles.filterButtonText
              }>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <PedidoCard
            item={item}
            onUpdate={() =>
              handleUpdate(
                item.controleStatusItemPedidoDtoDetalhar?.id,
                item.controleStatusItemPedidoDtoDetalhar?.status?.descricao
              )
            }
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
  header: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.white,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.secondary,
  },
  filterButtonActive: {
    backgroundColor: colors.accent,
  },
  filterButtonText: {
    color: colors.white,
  },
  filterButtonTextActive: {
    color: colors.textDark,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#2c2c2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  observacao: {
    fontSize: 14,
    color: '#d1d1d6',
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    color: colors.accent,
    marginTop: 4,
    marginBottom: 8,
  },
});

export default GerenciarPedidosScreen;
