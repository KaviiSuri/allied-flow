import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { api } from "~/utils/api";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>this is the header</Text>
      </View>
      <View style={styles.main}>
        <Text style={styles.h1text}>no team members</Text>
        <Text>Add new team members </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="add member" onPress={() => { /* Handle add member */ }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0ff'
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  h1text : {
    fontSize: 18,
    fontWeight: 800,
  
  },
  buttonContainer: {
    width: '50%', // Adjust the width as needed
    // Optional: additional styling for the button container
  },
});