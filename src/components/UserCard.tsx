import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../styles/colors';

interface Props {
  nome: string;
  email: string;
  cpf: string;
  cargo: string;
  onDelete: () => void;
}

export const UserCard: React.FC<Props> = ({ nome, email, cpf, cargo, onDelete }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{nome}</Text>
      <Text style={styles.text}>Email: {email}</Text>
      <Text style={styles.text}>CPF: {cpf}</Text>
      <Text style={styles.text}>Cargo: {cargo}</Text>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: colors.error,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});
