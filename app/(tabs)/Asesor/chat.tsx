// app/(tabs)/Asesor/chat.tsx
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { useChat } from "@/src/presentation/hooks/useChat";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatAsesorScreen() {
  const { usuario } = useAuth();
  const [destinatarioSeleccionado, setDestinatarioSeleccionado] = useState<string | null>(null);
  const {
    mensajes,
    conversaciones,
    cargando,
    escribiendo,
    enviarMensaje,
  } = useChat(destinatarioSeleccionado || undefined);

  const [texto, setTexto] = useState("");
  const flatRef = useRef<FlatList>(null);

  // Scroll al final al cambiar los mensajes
  useEffect(() => {
    if (flatRef.current && mensajes.length > 0) {
      flatRef.current.scrollToEnd({ animated: true });
    }
  }, [mensajes]);

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Pantalla de historial de conversaciones
  if (!destinatarioSeleccionado) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Mis Conversaciones</Text>
        {conversaciones.length === 0 ? (
          <View style={styles.centrado}>
            <Text style={styles.textoVacio}>
              No hay conversaciones pendientes
            </Text>
          </View>
        ) : (
          <FlatList
            data={conversaciones}
            keyExtractor={(item) => item.destinatarioid}
            contentContainerStyle={styles.lista}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.conversacionItem}
                onPress={() => setDestinatarioSeleccionado(item.destinatarioid)}
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "#007AFF",
                    marginRight: 12,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.nombreUsuario}>
                    {item.usuario?.nombre || "Cliente"}
                  </Text>
                  <Text style={styles.ultimoMensaje} numberOfLines={1}>
                    {item.mensaje || "Sin mensajes"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }

  // Pantalla de chat individual
  const handleEnviar = async () => {
    if (!texto.trim() || escribiendo) return;

    const mensaje = texto;
    setTexto("");

    try {
      await enviarMensaje(mensaje);
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      alert("Error al enviar mensaje");
      setTexto(mensaje);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDestinatarioSeleccionado(null)}>
          <Text style={styles.botonVolver}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Chat</Text>
      </View>

      {/* Mensajes */}
      <FlatList
        ref={flatRef}
        data={mensajes}
        keyExtractor={(item) => item.mensajeid}
        contentContainerStyle={styles.mensajesContainer}
        renderItem={({ item }) => {
          const esMio = item.usuarioid === usuario?.usuarioid;

          return (
            <View
              style={[
                styles.mensajeContainer,
                esMio ? styles.mensajeMio : styles.mensajeOtro,
              ]}
            >
              <Text style={[styles.contenidoMensaje, esMio && styles.textoMio]}>
                {item.mensaje}
              </Text>
              <Text
                style={[
                  styles.horaMensaje,
                  esMio && styles.horaTextoMio,
                ]}
              >
                {new Date(item.created_at).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          );
        }}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#999"
          value={texto}
          onChangeText={setTexto}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.botonEnviar,
            (escribiendo || !texto.trim()) && styles.botonDeshabilitado,
          ]}
          onPress={handleEnviar}
          disabled={escribiendo || !texto.trim()}
        >
          <Text style={styles.textoEnviar}>
            {escribiendo ? "..." : "Enviar"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    color: "#333",
  },
  textoVacio: {
    fontSize: 16,
    color: "#999",
  },
  lista: {
    paddingHorizontal: 8,
  },
  conversacionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  nombreUsuario: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  ultimoMensaje: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#007AFF",
  },
  botonVolver: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  headerTitulo: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  mensajesContainer: {
    paddingVertical: 8,
  },
  mensajeContainer: {
    marginHorizontal: 12,
    marginVertical: 4,
    maxWidth: "80%",
    padding: 10,
    borderRadius: 12,
  },
  mensajeMio: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  mensajeOtro: {
    alignSelf: "flex-start",
    backgroundColor: "#ddd",
  },
  contenidoMensaje: {
    fontSize: 14,
    color: "#333",
  },
  textoMio: {
    color: "#fff",
  },
  horaMensaje: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
  },
  horaTextoMio: {
    color: "rgba(255,255,255,0.7)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    fontSize: 14,
    maxHeight: 100,
  },
  botonEnviar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#007AFF",
    borderRadius: 20,
  },
  botonDeshabilitado: {
    backgroundColor: "#ccc",
  },
  textoEnviar: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
