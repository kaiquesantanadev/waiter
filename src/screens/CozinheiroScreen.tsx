import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GarcomScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem-vindo, Garçom!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#DEEFE7' },
  text: { fontSize: 24, color: '#002333' },
});
