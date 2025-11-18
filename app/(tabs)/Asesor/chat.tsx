// app/(tabs)/Asesor/chat.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useChat } from "@/src/presentation/hooks/useChat";

type Mensaje = {
  id: string;
  contenido: string;
  created_at: string;
  usuario_id: string;
  usuario?: { id: string; nombre: string };
};

export default function ChatScreen() {
  const router = useRouter();
  const { conversaciones, mensajesPorConversacion, cargando, enviarMensaje } = useChat();
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const flatRef = useRef<FlatList>(null);

  // Scroll al final al cambiar los mensajes
  useEffect(() => {
    if (flatRef.current) {
      flatRef.current.scrollToEnd({ animated: true });
    }
  }, [mensajesPorConversacion, seleccionado]);

  if (cargando) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  // Pantalla de historial
  if (!seleccionado) {
    return (
      <FlatList
        data={conversaciones}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 12,
              borderBottomWidth: 1,
              borderColor: "#eee",
            }}
            onPress={() => setSeleccionado(item.id)}
          >
            {/* Indicador online */}
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: "#007AFF",
                marginRight: 12,
              }}
            />
            <View>
              <Text style={{ fontWeight: "600", fontSize: 16 }}>{item.usuario?.nombre}</Text>
              <Text style={{ color: "#666" }}>{item.ultimoMensaje?.contenido || ""}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  }

  // Pantalla de chat individual
  const mensajes: Mensaje[] = mensajesPorConversacion[seleccionado] || [];

  const handleEnviar = async () => {
    if (!texto.trim()) return;
    await enviarMensaje(seleccionado, texto);
    setTexto("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={{ padding: 16, backgroundColor: "#007AFF" }}>
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 18 }}>
          {conversaciones.find((c) => c.id === seleccionado)?.usuario?.nombre || "Chat"}
        </Text>
        <TouchableOpacity
          style={{ position: "absolute", left: 16, top: 16 }}
          onPress={() => setSeleccionado(null)}
        >
          <Text style={{ color: "#fff" }}>⬅ Volver</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatRef}
        data={mensajes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const esMio = item.usuario_id === "usuario_actual_id"; // reemplazar con id real
          return (
            <View
              style={{
                alignSelf: esMio ? "flex-end" : "flex-start",
                backgroundColor: esMio ? "#007AFF" : "#FFF",
                padding: 12,
                borderRadius: 12,
                marginBottom: 8,
                maxWidth: "75%",
              }}
            >
              {!esMio && <Text style={{ fontWeight: "600", marginBottom: 4 }}>{item.usuario?.nombre}</Text>}
              <Text style={{ color: esMio ? "#FFF" : "#000" }}>{item.contenido}</Text>
              <Text
                style={{
                  fontSize: 10,
                  color: esMio ? "rgba(255,255,255,0.7)" : "#999",
                  alignSelf: "flex-end",
                }}
              >
                {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
          );
        }}
      />

      <View
        style={{
          flexDirection: "row",
          padding: 8,
          borderTopWidth: 1,
          borderColor: "#eee",
          backgroundColor: "#fff",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            padding: 8,
            backgroundColor: "#f5f5f5",
          }}
          value={texto}
          onChangeText={setTexto}
          placeholder="Escribe un mensaje..."
        />
        <TouchableOpacity
          onPress={handleEnviar}
          style={{ marginLeft: 8, backgroundColor: "#007AFF", padding: 12, borderRadius: 20 }}
        >
          <Text style={{ color: "#fff" }}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
