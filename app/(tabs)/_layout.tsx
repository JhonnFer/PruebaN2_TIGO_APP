// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    //solo si el rol es registrado 
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Inicio" }} />
      <Tabs.Screen name="MisPlanes" options={{ title: "Mis Planes" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />


     
      <Tabs.Screen name="index" options={{ title: "Planes" }} />
      <Tabs.Screen name="Solicitudes" options={{ title: "Solicitudes" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
    </Tabs>
    //solo si el rol es Asesor 
  );
}
