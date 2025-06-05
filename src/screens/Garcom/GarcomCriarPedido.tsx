import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import colors from '../../styles/colors';
import * as Animatable from 'react-native-animatable';
import { SubmitButton } from '../../components/SubmitButton';
import axios from 'axios';
import { BASE_URL } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CriarPedidoScreen: React.FC = () => {
  const [mesa, setMesa] = useState<number>(1);
  const [comanda, setComanda] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [produtos, setProdutos] = useState<any[]>([]);
  const [pedido, setPedido] = useState<any[]>([]);
  const [observacao, setObservacao] = useState('');

  const fetchProdutos = async (tipoProduto: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `http://${BASE_URL}/produto/status?statusGeral=ATIVO&tipoProduto=${tipoProduto}&size=30`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProdutos(response.data.content);
      setCategoriaSelecionada(tipoProduto);
      setModalVisible(true);
    } catch (error: any) {
      console.log(error);
      Alert.alert('Erro', 'Falha ao carregar os produtos.');
    }
  };

  const adicionarProduto = (produto: any) => {
    setPedido(prev => [...prev, { ...produto, observacao }]);
    setObservacao('');
    setModalVisible(false);
  };

  const removerProduto = (index: number) => {
    setPedido(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInDown" style={styles.titleContainer}>
        <Text style={styles.title}>Novo Pedido</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={100} style={styles.formContainer}>
        <Text style={styles.label}>Mesa</Text>
        <Picker
          selectedValue={mesa}
          onValueChange={setMesa}
          style={styles.picker}
        >
          {[...Array(10)].map((_, i) => (
            <Picker.Item key={i} label={`Mesa ${i + 1}`} value={i + 1} />
          ))}
        </Picker>

        <Text style={styles.label}>Comanda</Text>
        <Picker
          selectedValue={comanda}
          onValueChange={setComanda}
          style={styles.picker}
        >
          {[...Array(50)].map((_, i) => (
            <Picker.Item key={i} label={`Comanda ${i + 1}`} value={i + 1} />
          ))}
        </Picker>

        <View style={styles.buttonRow}>
          {['PRATO', 'BEBIDA', 'SOBREMESA'].map(tipo => (
            <TouchableOpacity
              key={tipo}
              style={styles.categoryButton}
              onPress={() => fetchProdutos(tipo)}
            >
              <Text style={styles.buttonText}>{tipo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.categoryButton, { marginTop: 20 }]}
          onPress={() => {
            if (pedido.length === 0)
              return Alert.alert('Aviso', 'Nenhum item no pedido.');

            Alert.alert(
              'Pedido Atual',
              pedido
                .map((p, i) => `${i + 1}. ${p.nome} - Obs: ${p.observacao || '-'}`)
                .join('\n'),
              [
                { text: 'OK' },
                {
                  text: 'Excluir todos',
                  onPress: () => setPedido([]),
                  style: 'destructive',
                },
              ]
            );
          }}
        >
          <Text style={styles.buttonText}>Visualizar Pedido</Text>
        </TouchableOpacity>

        {/* botão submit a fazer - gustavo */}
        <View style={{ marginTop: 30 }}>
          <SubmitButton label="Enviar Pedido" onPress={() => {
            Alert.alert('Em breve', 'Funcionalidade de envio ainda não implementada.');
          }} />
        </View>
      </Animatable.View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar {categoriaSelecionada}</Text>

            <FlatList
              data={produtos}
              keyExtractor={item => item.id.toString()}
              style={{ marginBottom: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => adicionarProduto(item)}
                >
                  <Text style={styles.modalItemText}>{item.nome}</Text>
                </TouchableOpacity>
              )}
            />

            <TextInput
              placeholder="Observações"
              placeholderTextColor={colors.textDark}
              value={observacao}
              onChangeText={setObservacao}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.cancelButtonContainer}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  titleContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
  formContainer: {
    marginTop: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.textDark,
  },
  picker: {
    backgroundColor: colors.white,
    marginBottom: 15,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    width: '100%',
    padding: 20,
    borderRadius: 16,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.textDark,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    borderColor: colors.background,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.textDark,
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.textDark,
    padding: 10,
    borderRadius: 8,
    color: colors.textDark,
    backgroundColor: '#f9f9f9',
  },
  cancelButtonContainer: {
    marginTop: 20,
    backgroundColor: colors.error,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CriarPedidoScreen;
