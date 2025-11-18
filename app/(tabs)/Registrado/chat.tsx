//app/(tabs)/Registrado/chat.tsx
import { Mensaje } from "@/src/domain/models/Mensaje";
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

export default function ChatRegistradoScreen() {
  const { usuario } = useAuth();
  const [destinatarioSeleccionado, setDestinatarioSeleccionado] = useState<
    string | null
  >(null);
  const {
    mensajes,
    conversaciones,
    cargando,
    escribiendo,
    enviarMensaje,
  } = useChat(destinatarioSeleccionado || undefined);

  const [textoMensaje, setTextoMensaje] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll al final cuando llegan nuevos mensajes
  useEffect(() => {
    if (mensajes.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [mensajes]);

  const handleEnviar = async () => {
    if (!textoMensaje.trim() || escribiendo || !destinatarioSeleccionado)
      return;

    const mensaje = textoMensaje;
    setTextoMensaje("");

    try {
      await enviarMensaje(mensaje);
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      alert("Error al enviar el mensaje");
      setTextoMensaje(mensaje);
    }
  };

  const renderMensaje = ({ item }: { item: Mensaje }) => {
    const esMio = item.usuarioid === usuario?.usuarioid;

    return (
      <View
        style={[
          styles.mensajeContainer,
          esMio ? styles.mensajeMio : styles.mensajeOtro,
        ]}
      >
        {!esMio && (
          <Text style={styles.nombreUsuario}>
            {item.usuario?.nombre || "Asesor"}
          </Text>
        )}
        <Text
          style={[
            styles.contenidoMensaje,
            esMio && styles.contenidoMensajeMio,
          ]}
        >
          {item.mensaje}
        </Text>
        <Text
          style={[styles.horaMensaje, esMio && styles.horaMensajeMio]}
        >
          {new Date(item.created_at).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  const renderConversacion = ({
    item,
  }: {
    item: Mensaje;
  }) => (
    <TouchableOpacity
      style={[
        styles.conversacionItem,
        destinatarioSeleccionado === item.destinatarioid &&
        styles.conversacionItemSeleccionada,
      ]}
      onPress={() => setDestinatarioSeleccionado(item.destinatarioid)}
    >
      <View style={styles.conversacionIndicador} />
      <View style={styles.conversacionTexto}>
        <Text style={styles.conversacionNombre}>
          {item.usuario?.nombre || "Asesor"}
        </Text>
        <Text style={styles.conversacionUltimoMensaje} numberOfLines={1}>
          {item.mensaje}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Si no hay destinatario seleccionado, mostrar lista de conversaciones
  if (!destinatarioSeleccionado) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Mis Conversaciones</Text>
        {cargando ? (
          <View style={styles.centrado}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : conversaciones.length === 0 ? (
          <View style={styles.centrado}>
            <Text style={styles.textoVacio}>
              No hay conversaciones aún.
            </Text>
            <Text style={styles.textoVacioSubtitulo}>
              Contrata un plan para empezar a chatear con un asesor
            </Text>
          </View>
        ) : (
          <FlatList
            data={conversaciones}
            renderItem={renderConversacion}
            keyExtractor={(item) => item.destinatarioid}
            contentContainerStyle={styles.listaConversaciones}
          />
        )}
      </View>
    );
  }

  // Chat individual
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDestinatarioSeleccionado(null)}>
          <Text style={styles.botonVolver}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Chat con Asesor</Text>
      </View>

      {/* Mensajes */}
      <FlatList
        ref={flatListRef}
        data={mensajes}
        renderItem={renderMensaje}
        keyExtractor={(item) => item.mensajeid}
        contentContainerStyle={styles.listContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#999"
          value={textoMensaje}
          onChangeText={setTextoMensaje}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.botonEnviar,
            (escribiendo || !textoMensaje.trim()) &&
            styles.botonEnviarDeshabilitado,
          ]}
          onPress={handleEnviar}
          disabled={escribiendo || !textoMensaje.trim()}
        >
          <Text style={styles.botonEnviarTexto}>
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
    color: "#666",
  },
  textoVacioSubtitulo: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  listaConversaciones: {
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
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
  },
  conversacionItemSeleccionada: {
    borderLeftColor: "#007AFF",
    backgroundColor: "#f0f8ff",
  },
  conversacionIndicador: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
    marginRight: 12,
  },
  conversacionTexto: {
    flex: 1,
  },
  conversacionNombre: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  conversacionUltimoMensaje: {
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
  listContainer: {
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
  nombreUsuario: {
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 4,
    color: "#666",
  },
  contenidoMensaje: {
    fontSize: 14,
    color: "#333",
  },
  contenidoMensajeMio: {
    color: "#fff",
  },
  horaMensaje: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
  },
  horaMensajeMio: {
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
  botonEnviarDeshabilitado: {
    backgroundColor: "#ccc",
  },
  botonEnviarTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
