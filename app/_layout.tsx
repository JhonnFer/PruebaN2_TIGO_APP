import React from "react";
import { View, StatusBar } from "react-native";
import { Stack } from "expo-router";
import { globalStyles } from "../src/styles/globalStyles";

export default function AppLayout() {
  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack
        screenOptions={{
          headerShown: false, // ocultamos el header global
        }}
      />
    </View>
  );
}
