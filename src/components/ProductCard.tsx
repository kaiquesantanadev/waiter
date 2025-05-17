import React, { useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import colors from '../styles/colors';

interface ProductCardProps {
  nome: string;
  descricao: string;
  preco: number;
  tipo: string;
  imagem: string;
  onDelete: () => void;
  isDeleting?: boolean; // Optional loading state
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  nome, 
  descricao, 
  preco, 
  tipo, 
  imagem, 
  onDelete,
  isDeleting = false 
}) => {
  const handleDeletePress = useCallback(() => {
    if (!isDeleting) {
      onDelete();
    }
  }, [onDelete, isDeleting]);

  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: imagem }} 
        style={styles.image} 
        resizeMode="cover"
        onError={() => console.log('Error loading image')}
      />
      <Text style={styles.title}>{nome}</Text>
      <Text style={styles.text}>Descrição: {descricao}</Text>
      <Text style={styles.text}>Preço: R$ {preco.toFixed(2)}</Text>
      <Text style={styles.text}>Tipo: {tipo}</Text>

      <TouchableOpacity 
        style={[
          styles.deleteButton,
          isDeleting && styles.disabledButton
        ]} 
        onPress={handleDeletePress}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.deleteText}>Excluir</Text>
        )}
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
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
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
  disabledButton: {
    opacity: 0.6,
  },
  deleteText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default ProductCard;