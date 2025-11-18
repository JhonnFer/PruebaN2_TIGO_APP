// app/(tabs)/Invitado/index.tsx
import { usePlanMovil } from "@/src/presentation/hooks/usePlanMovil";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function InvitadoCatalogo() {
    const router = useRouter();
    const { planes, cargando } = usePlanMovil();
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar planes activos
    const planesActivos = planes.filter(
        (plan) =>
            plan.activo &&
            plan.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderPlan = ({ item }: any) => (
        <View style={styles.planCard}>
            {/* Imagen del plan */}
            {item.imagen_url ? (
                <Image
                    source={{ uri: item.imagen_url }}
                    style={styles.planImagen}
                    resizeMode="cover"
                />
            ) : (
                <View style={[styles.planImagen, styles.imagenPlaceholder]}>
                    <Text style={styles.textoImagen}>📱</Text>
                </View>
            )}

            {/* Contenido del plan */}
            <View style={styles.planContenido}>
                <Text style={styles.planNombre}>{item.nombre}</Text>

                {item.descripcion && (
                    <Text style={styles.planDescripcion}>{item.descripcion}</Text>
                )}

                {/* Características */}
                <View style={styles.caracteristicas}>
                    {item.datos && (
                        <Text style={styles.caracteristica}>
                            💾 {item.datos} GB
                        </Text>
                    )}
                    {item.minutos && (
                        <Text style={styles.caracteristica}>
                            📞 {item.minutos} min
                        </Text>
                    )}
                </View>

                {/* Precio */}
                <Text style={styles.planPrecio}>
                    ${item.precio?.toLocaleString()}
                </Text>

                {/* Botón Ver Detalles */}
                <TouchableOpacity
                    style={styles.botonDetalles}
                    onPress={() =>
                        router.push({
                            pathname: "/(tabs)/Registrado/detalle-plan/[id]",
                            params: { id: item.planid },
                        })
                    }
                >
                    <Text style={styles.textoBotonDetalles}>Ver Detalles</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tigo Conecta</Text>
            </View>

            {/* Mensaje inicial */}
            <View style={styles.seccionBienvenida}>
                <Text style={styles.pregunta}>¿Quieres contratar un plan?</Text>
                <TouchableOpacity
                    style={styles.botonLogin}
                    onPress={() => router.push("/auth/login")}
                >
                    <Text style={styles.textoBotonLogin}>Inicia Sesión</Text>
                </TouchableOpacity>
            </View>

            {/* Sección de planes */}
            <View style={styles.seccionPlanes}>
                <Text style={styles.tituloSeccion}>Nuevos Planes Tigo</Text>
                <Text style={styles.subtituloSeccion}>
                    Los mejores planes del mercado
                </Text>
            </View>

            {/* Búsqueda */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar planes..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    placeholderTextColor="#999"
                />
                <TouchableOpacity style={styles.botonBuscar}>
                    <Text style={styles.iconoBuscar}>🔍</Text>
                </TouchableOpacity>
            </View>

            {/* Lista de planes */}
            {cargando ? (
                <View style={styles.centrado}>
                    <ActivityIndicator size="large" color="#0047B8" />
                </View>
            ) : planesActivos.length === 0 ? (
                <View style={styles.centrado}>
                    <Text style={styles.textoVacio}>No hay planes disponibles</Text>
                </View>
            ) : (
                <FlatList
                    data={planesActivos}
                    renderItem={renderPlan}
                    keyExtractor={(item) => item.planid}
                    contentContainerStyle={styles.listContainer}
                    scrollEnabled={true}
                />
            )}

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.botonRegistro}
                    onPress={() => router.push("/auth/registro")}
                >
                    <Text style={styles.textoBotonRegistro}>
                        ¿No tienes cuenta? Regístrate
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    header: {
        backgroundColor: "#0047B8",
        paddingVertical: 16,
        paddingHorizontal: 16,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#FFF",
    },
    seccionBienvenida: {
        backgroundColor: "#FFF",
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginHorizontal: 12,
        marginTop: 12,
        borderRadius: 8,
        gap: 12,
    },
    pregunta: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    },
    botonLogin: {
        backgroundColor: "#0047B8",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    textoBotonLogin: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "700",
    },
    seccionPlanes: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    tituloSeccion: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
    },
    subtituloSeccion: {
        fontSize: 12,
        color: "#999",
        marginTop: 4,
    },
    searchContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginBottom: 12,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        backgroundColor: "#FFF",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: "#333",
        borderWidth: 1,
        borderColor: "#DDD",
    },
    botonBuscar: {
        backgroundColor: "#0047B8",
        width: 44,
        height: 44,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    iconoBuscar: {
        fontSize: 18,
    },
    listContainer: {
        paddingHorizontal: 12,
        paddingBottom: 20,
    },
    planCard: {
        backgroundColor: "#FFF",
        borderRadius: 8,
        marginBottom: 12,
        overflow: "hidden",
        elevation: 2,
    },
    planImagen: {
        width: "100%",
        height: 160,
        backgroundColor: "#E8E8E8",
    },
    imagenPlaceholder: {
        justifyContent: "center",
        alignItems: "center",
    },
    textoImagen: {
        fontSize: 48,
    },
    planContenido: {
        padding: 12,
    },
    planNombre: {
        fontSize: 16,
        fontWeight: "700",
        color: "#0047B8",
        marginBottom: 4,
    },
    planDescripcion: {
        fontSize: 12,
        color: "#666",
        marginBottom: 8,
    },
    caracteristicas: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 8,
    },
    caracteristica: {
        fontSize: 11,
        backgroundColor: "#E3F2FD",
        color: "#0047B8",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    planPrecio: {
        fontSize: 18,
        fontWeight: "700",
        color: "#00AA00",
        marginBottom: 8,
    },
    botonDetalles: {
        backgroundColor: "#0047B8",
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: "center",
    },
    textoBotonDetalles: {
        color: "#FFF",
        fontSize: 13,
        fontWeight: "700",
    },
    centrado: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    textoVacio: {
        fontSize: 14,
        color: "#999",
    },
    footer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#EEE",
    },
    botonRegistro: {
        paddingVertical: 12,
        alignItems: "center",
    },
    textoBotonRegistro: {
        fontSize: 13,
        color: "#0047B8",
        fontWeight: "600",
    },
});
