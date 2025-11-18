import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { globalStyles } from "@/src/styles/globalStyles";

export default function BienvenidaScreen() {
  const router = useRouter();

  return (
    <View style={globalStyles.containerCentered}>
      <View
        style={{
          width: "90%",
          padding: 20,
          backgroundColor: "#007bff",
          borderRadius: 10,
          marginBottom: 30,
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#fff", textAlign: "center" }}>
          Bienvenido a Tigo
        </Text>
        <Text style={{ fontSize: 16, color: "#dfe6fd", textAlign: "center", marginTop: 8 }}>
          Descubre nuestros planes móviles
        </Text>
      </View>

      <TouchableOpacity
        style={[globalStyles.button, globalStyles.buttonPrimary, { width: "100%" }]}
        onPress={() => router.push("/explore")}
      >
        <Text style={globalStyles.buttonText}>Explorar como Invitado</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[globalStyles.button, globalStyles.buttonSecondary, { width: "100%", marginTop: 10 }]}
        onPress={() => router.push("/auth/login")}
      >
        <Text style={globalStyles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          globalStyles.button,
          { width: "100%", backgroundColor: "#28a745", marginTop: 10 },
        ]}
        onPress={() => router.push("/auth/registro")}
      >
        <Text style={globalStyles.buttonText}>Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}
