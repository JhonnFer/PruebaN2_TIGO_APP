import { Tabs } from "expo-router";
import React from "react";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Platform, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS_ACTIVE_COLOR = "#0047B8";
const TABS_BACKGROUND_COLOR = "#fff";
const TABS_INACTIVE_COLOR = "#A0A0A0";

export default function RegistradoTabsLayout() {
  const insets = useSafeAreaInsets();

  const TAB_BAR_HEIGHT = 60;
  const BOTTOM_PADDING = Platform.OS === "ios" ? insets.bottom : 5;

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: TABS_BACKGROUND_COLOR,
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 5,
            height: TAB_BAR_HEIGHT + BOTTOM_PADDING,
            paddingBottom: BOTTOM_PADDING,
          },
          tabBarActiveTintColor: TABS_ACTIVE_COLOR,
          tabBarInactiveTintColor: TABS_INACTIVE_COLOR,
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="MisPlanes"
          options={{
            title: "Mis Planes",
            tabBarIcon: ({ color }) => <FontAwesome5 name="shopping-cart" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses-outline" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color }) => <FontAwesome5 name="user-alt" size={24} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda la pantalla
    backgroundColor: "#fff",
    paddingBottom: Platform.OS === "ios" ? 0 : 5, // Ajuste extra para Android
  },
});
