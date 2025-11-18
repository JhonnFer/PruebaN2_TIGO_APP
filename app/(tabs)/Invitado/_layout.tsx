import { Tabs } from "expo-router";
import React from "react";

export default function InvitadoTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarActiveTintColor: "#4CAF50",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Inicio" }} />
      {/* Puedes agregar más tabs si quieres */}
    </Tabs>
  );
}
