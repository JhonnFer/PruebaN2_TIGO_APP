// app/rutina/_layout.tsx
import { Stack } from "expo-router";

export default function RutinaLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="crear" />
      <Stack.Screen name="editar" />
    </Stack>
  );
}
