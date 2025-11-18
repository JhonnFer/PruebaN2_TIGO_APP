// app/(tabs)/Registrado/detalle-plan/[id].tsx
import { supabase } from "@/src/data/services/supabaseClient";
import { PlanMovil } from "@/src/domain/models/PlanMovil";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { useSolicitudes } from "@/src/presentation/hooks/useSolicitudes";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function DetallePlanScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { usuario } = useAuth();
    const { crearSolicitud } = useSolicitudes();

    const [plan, setPlan] = useState<PlanMovil | null>(null);
    const [cargando, setCargando] = useState(true);
    const [contratando, setContratando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar detalles del plan
    useEffect(() => {
        const cargarPlan = async () => {
            try {
                setCargando(true);
                setError(null);

                const { data, error: err } = await supabase
                    .from("planes_moviles")
                    .select("*")
                    .eq("planid", id)
                    .single();

                if (err) throw new Error(err.message);
                setPlan(data as PlanMovil);
            } catch (error) {
                console.error("Error cargando plan:", error);
                setError("No se pudo cargar el plan");
            } finally {
                setCargando(false);
            }
        };

        if (id) cargarPlan();
    }, [id]);

    const handleContratar = async () => {
        if (!plan || !usuario) return;

        try {
            setContratando(true);

            // Crear solicitud de contratación
            await crearSolicitud({
                planid: plan.planid,
                usuarioid: usuario.usuarioid,
                estado: "pendiente",
                fecha_solicitud: new Date().toISOString(),
            });

            // Mostrar éxito y volver
            alert("Plan contratado exitosamente");
            router.back();
        } catch (error) {
            console.error("Error contratando plan:", error);
            alert("Error al contratar el plan");
        } finally {
            setContratando(false);
        }
    };

    if (cargando) {
        return (
            <View style={styles.centrado}>
                <ActivityIndicator size="large" color="#0047B8" />
            </View>
        );
    }

    if (error || !plan) {
        return (
            <View style={styles.centrado}>
                <Text style={styles.textoError}>{error || "Plan no encontrado"}</Text>
                <TouchableOpacity
                    style={styles.botonVolver}
                    onPress={() => router.back()}
                >
                    <Text style={styles.textoBotonVolver}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header con botón volver */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.botonVolverText}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalle del Plan</Text>
                <View style={{ width: 50 }} />
            </View>

            {/* Imagen del plan */}
            {plan.imagen_url ? (
                <Image
                    source={{ uri: plan.imagen_url }}
                    style={styles.imagenPlan}
                    resizeMode="cover"
                />
            ) : (
                <View style={[styles.imagenPlan, styles.sinImagen]}>
                    <Text style={styles.textoSinImagen}>Sin imagen</Text>
                </View>
            )}

            {/* Contenido */}
            <View style={styles.contenido}>
                {/* Nombre del plan */}
                <Text style={styles.nombre}>{plan.nombre}</Text>

                {/* Precio */}
                <Text style={styles.precio}>
                    ${plan.precio?.toLocaleString()} COP/mes
                </Text>

                {/* Descripción */}
                {plan.descripcion && (
                    <View style={styles.seccion}>
                        <Text style={styles.tituloSeccion}>Descripción</Text>
                        <Text style={styles.texto}>{plan.descripcion}</Text>
                    </View>
                )}

                {/* Características */}
                <View style={styles.seccion}>
                    <Text style={styles.tituloSeccion}>Características</Text>

                    {plan.datos && (
                        <View style={styles.caracteristica}>
                            <Text style={styles.etiqueta}>💾 Datos:</Text>
                            <Text style={styles.valor}>{plan.datos} GB</Text>
                        </View>
                    )}

                    {plan.minutos && (
                        <View style={styles.caracteristica}>
                            <Text style={styles.etiqueta}>📞 Minutos:</Text>
                            <Text style={styles.valor}>{plan.minutos} min</Text>
                        </View>
                    )}

                    {plan.velocidad && (
                        <View style={styles.caracteristica}>
                            <Text style={styles.etiqueta}>⚡ Velocidad:</Text>
                            <Text style={styles.valor}>{plan.velocidad}</Text>
                        </View>
                    )}

                    {plan.sms && (
                        <View style={styles.caracteristica}>
                            <Text style={styles.etiqueta}>✉️ SMS:</Text>
                            <Text style={styles.valor}>{plan.sms} SMS</Text>
                        </View>
                    )}
                </View>

                {/* Términos y condiciones */}
                <View style={styles.seccion}>
                    <Text style={styles.tituloSeccion}>Términos</Text>
                    <Text style={styles.textoChico}>
                        Al contratar este plan, aceptas los términos y condiciones de Tigo.
                        El servicio comienza inmediatamente después de la confirmación.
                    </Text>
                </View>
            </View>

            {/* Botón Contratar (sticky) */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.botonContratar, contratando && styles.botonDeshabilitado]}
                    onPress={handleContratar}
                    disabled={contratando}
                >
                    <Text style={styles.textoBotonContratar}>
                        {contratando ? "Contratando..." : "Contratar Plan"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    botonVolverText: {
        color: "#0047B8",
        fontSize: 14,
        fontWeight: "500",
    },
    imagenPlan: {
        width: width,
        height: 250,
        backgroundColor: "#EEE",
    },
    sinImagen: {
        justifyContent: "center",
        alignItems: "center",
    },
    textoSinImagen: {
        color: "#999",
        fontSize: 16,
    },
    contenido: {
        padding: 16,
        paddingBottom: 120,
    },
    nombre: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#0047B8",
        marginBottom: 8,
    },
    precio: {
        fontSize: 24,
        fontWeight: "700",
        color: "#00AA00",
        marginBottom: 24,
    },
    seccion: {
        marginBottom: 24,
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 8,
    },
    tituloSeccion: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 12,
    },
    texto: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
    },
    textoChico: {
        fontSize: 12,
        color: "#999",
        lineHeight: 18,
    },
    caracteristica: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    etiqueta: {
        fontSize: 14,
        fontWeight: "500",
        color: "#666",
    },
    valor: {
        fontSize: 14,
        fontWeight: "700",
        color: "#0047B8",
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#FFF",
        borderTopWidth: 1,
        borderTopColor: "#EEE",
    },
    botonContratar: {
        backgroundColor: "#0047B8",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    botonDeshabilitado: {
        opacity: 0.6,
    },
    textoBotonContratar: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
    botonVolver: {
        padding: 8,
    },
    centrado: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    textoError: {
        fontSize: 16,
        color: "#E74C3C",
        marginBottom: 16,
    },
});
