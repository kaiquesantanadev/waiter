import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

import colors from '../../styles/colors';
import { SubmitButton } from '../../components/SubmitButton';
import { BASE_URL } from '../../config/api';

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
  mesa: number; // adicionando mesa aqui
}

interface PedidoCardProps {
  item: ItemPedido;
  onUpdate: () => void;
}

const PedidoCard: React.FC<PedidoCardProps> = ({ item, onUpdate }) => {
  const nomeProduto = item.produto?.nome;
  const observacao = item.observacao || 'Sem observações';
  const statusAtual = item.controleStatusItemPedidoDtoDetalhar?.status?.descricao;
  const mesa = item.mesa;

  return (
    <View style={styles.card}>
      <Text style={styles.nome}>{nomeProduto}</Text>
      <Text style={styles.mesa}>Mesa: {mesa}</Text> {/* Aqui mostramos a mesa */}
      <Text style={styles.observacao}>Observação: {observacao}</Text>
      <Text style={styles.status}>Status: {statusAtual}</Text>
      <SubmitButton label="Atualizar" onPress={onUpdate} />
    </View>
  );
};

const GerenciarPedidosGarcomScreen: React.FC = () => {
  const [pedidos, setPedidos] = useState<ItemPedido[]>([]);
  const statusFiltrado = 'PRONTO'; // status fixo para o garçom

  const fetchPedidos = async () => {
    console.log(`🔄 Buscando pedidos com status: ${statusFiltrado}`);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`http://${BASE_URL}/pedido/status`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          statusProcesso: statusFiltrado,
          size: 50,
        },
      });

      console.log('✅ Resposta da API recebida.');
      const pedidosComItens = response.data?.content || [];

      const todosItens: ItemPedido[] = pedidosComItens.flatMap((pedido: any) =>
        (pedido.itensPedido || []).filter((item: any) => {
          const statusDesc = item.controleStatusItemPedidoDtoDetalhar?.status?.descricao
            ?.toUpperCase()
            ?.replace(/\s/g, '_');

          const isMatch = statusDesc === statusFiltrado;

          if (!isMatch) {
            console.log(
              `⏩ Item ignorado (status: ${statusDesc}, esperado: ${statusFiltrado})`
            );
          }

          return isMatch;
        }).map((item: any) => ({
          ...item,
          mesa: pedido.mesa, // adiciona a mesa do pedido pai dentro do item
        }))
      );

      console.log(`📦 Total de itens com status "${statusFiltrado}":`, todosItens.length);
      setPedidos(todosItens);
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos:', error);
      Alert.alert('Erro', 'Erro ao buscar pedidos.');
    }
  };

  const handleUpdate = async (idItemPedido: number) => {
    const novoStatus = 'ENTREGUE';
    console.log(`🛠 Atualizando itemPedido ID ${idItemPedido} para "${novoStatus}"...`);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `http://${BASE_URL}/controle-status-item-pedido/${idItemPedido}`,
        { descricao: 'Atualizado via app', status: novoStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Sucesso', 'Status atualizado para ENTREGUE com sucesso!');
      fetchPedidos();
    } catch (error: any) {
      console.log('❌ Erro ao atualizar status:', error.response?.data || error.message);
      Alert.alert('Erro', 'Erro ao atualizar status.');
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInDown" style={styles.header}>
        <Text style={styles.title}>Pedidos para Entrega</Text>
      </Animatable.View>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <PedidoCard
            item={item}
            onUpdate={() => handleUpdate(item.id)}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Nenhum pedido com status PRONTO.</Text>
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
  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  mesa: {
    fontSize: 16,
    color: colors.accent,
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
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textDark,
    fontSize: 16,
  },
});

export default GerenciarPedidosGarcomScreen;
