// app/(tabs)/Asesor/crear-plan.tsx
import { PlanMovil } from "@/src/domain/models/PlanMovil";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { usePlanMovil } from "@/src/presentation/hooks/usePlanMovil";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CrearPlanScreen() {
    const router = useRouter();
    const { usuario } = useAuth();
    const { crearPlan, subirImagenPlan } = usePlanMovil();

    // Estado del formulario
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [datos, setDatos] = useState("");
    const [minutos, setMinutos] = useState("");
    const [velocidad, setVelocidad] = useState("");
    const [sms, setSms] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagenSeleccionada, setImagenSeleccionada] = useState<any>(null);
    const [nombreImagen, setNombreImagen] = useState("");

    // Estados de carga
    const [guardando, setGuardando] = useState(false);
    const [cargandoImagen, setCargandoImagen] = useState(false);

    // Validar formulario
    const validar = (): boolean => {
        if (!nombre.trim()) {
            Alert.alert("Error", "El nombre del plan es requerido");
            return false;
        }
        if (!precio.trim() || isNaN(Number(precio))) {
            Alert.alert("Error", "El precio debe ser un número válido");
            return false;
        }
        return true;
    };

    // Seleccionar imagen
    const seleccionarImagen = async () => {
        try {
            setCargandoImagen(true);

            // Pedir permiso
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Error", "Necesitas permitir acceso a la galería");
                return;
            }

            // Abrir galería
            const resultado = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
            });

            if (!resultado.canceled) {
                const imagen = resultado.assets[0];
                setImagenSeleccionada(imagen);
                setNombreImagen(`plan_${Date.now()}.jpg`);
            }
        } catch (error) {
            console.error("Error seleccionando imagen:", error);
            Alert.alert("Error", "No se pudo seleccionar la imagen");
        } finally {
            setCargandoImagen(false);
        }
    };

    // Crear plan
    const handleCrear = async () => {
        if (!validar() || !usuario) return;

        try {
            setGuardando(true);

            let imagenUrl = null;

            // Si hay imagen, subirla primero
            if (imagenSeleccionada) {
                imagenUrl = await subirImagenPlan(imagenSeleccionada, nombreImagen);
            }

            // Crear plan
            const nuevoPlan: Partial<PlanMovil> = {
                nombre,
                precio: Number(precio),
                datos: datos ? Number(datos) : null,
                minutos: minutos ? Number(minutos) : null,
                velocidad: velocidad || null,
                sms: sms ? Number(sms) : null,
                descripcion: descripcion || null,
                usuarioid: usuario.usuarioid,
                activo: true,
                imagen_url: imagenUrl,
            };

            await crearPlan(nuevoPlan);

            Alert.alert("Éxito", "Plan creado exitosamente");
            router.back();
        } catch (error) {
            console.error("Error creando plan:", error);
            Alert.alert("Error", "No se pudo crear el plan");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.botonVolverText}>← Cancelar</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Crear Plan</Text>
                <View style={{ width: 50 }} />
            </View>

            <View style={styles.contenido}>
                {/* Información del Plan */}
                <Text style={styles.tituloSeccion}>Información del Plan</Text>

                {/* Nombre */}
                <View style={styles.campo}>
                    <Text style={styles.etiqueta}>Nombre del Plan *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: Plan Básico 5GB"
                        value={nombre}
                        onChangeText={setNombre}
                        editable={!guardando}
                    />
                </View>

                {/* Precio */}
                <View style={styles.campo}>
                    <Text style={styles.etiqueta}>Precio Mensual (COP) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: 29900"
                        value={precio}
                        onChangeText={setPrecio}
                        keyboardType="numeric"
                        editable={!guardando}
                    />
                </View>

                {/* Descripción */}
                <View style={styles.campo}>
                    <Text style={styles.etiqueta}>Descripción</Text>
                    <TextInput
                        style={[styles.input, styles.inputMultiline]}
                        placeholder="Describe tu plan..."
                        value={descripcion}
                        onChangeText={setDescripcion}
                        multiline
                        numberOfLines={3}
                        editable={!guardando}
                    />
                </View>

                {/* Características */}
                <Text style={[styles.tituloSeccion, { marginTop: 20 }]}>
                    Características
                </Text>

                {/* Datos */}
                <View style={styles.campo}>
                    <Text style={styles.etiqueta}>Datos (GB)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: 5"
                        value={datos}
                        onChangeText={setDatos}
                        keyboardType="numeric"
                        editable={!guardando}
                    />
                </View>

                {/* Minutos */}
                <View style={styles.campo}>
                    <Text style={styles.etiqueta}>Minutos Nacionales</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: 200"
                        value={minutos}
                        onChangeText={setMinutos}
                        keyboardType="numeric"
                        editable={!guardando}
                    />
                </View>

                {/* SMS */}
                <View style={styles.campo}>
                    <Text style={styles.etiqueta}>SMS Nacionales</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: 100"
                        value={sms}
                        onChangeText={setSms}
                        keyboardType="numeric"
                        editable={!guardando}
                    />
                </View>

                {/* Velocidad */}
                <View style={styles.campo}>
                    <Text style={styles.etiqueta}>Velocidad (4G/5G)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: 4G LTE"
                        value={velocidad}
                        onChangeText={setVelocidad}
                        editable={!guardando}
                    />
                </View>

                {/* Imagen */}
                <Text style={[styles.tituloSeccion, { marginTop: 20 }]}>
                    Imagen del Plan
                </Text>

                <TouchableOpacity
                    style={styles.botonSeleccionarImagen}
                    onPress={seleccionarImagen}
                    disabled={guardando || cargandoImagen}
                >
                    {cargandoImagen ? (
                        <ActivityIndicator color="#0047B8" />
                    ) : (
                        <>
                            <Text style={styles.textoBotonImagen}>
                                {imagenSeleccionada ? "✓ Imagen seleccionada" : "📸 Seleccionar imagen"}
                            </Text>
                            <Text style={styles.textoChico}>
                                Máximo 5MB, formato JPG o PNG
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                {imagenSeleccionada && (
                    <Text style={styles.textoImagen}>
                        Archivo: {imagenSeleccionada.filename}
                    </Text>
                )}
            </View>

            {/* Botones de acción */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.botonCancelar}
                    onPress={() => router.back()}
                    disabled={guardando}
                >
                    <Text style={styles.textoBotonCancelar}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.botonGuardar, guardando && styles.botonDeshabilitado]}
                    onPress={handleCrear}
                    disabled={guardando}
                >
                    <Text style={styles.textoBotonGuardar}>
                        {guardando ? "Creando..." : "Crear Plan"}
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
        color: "#E74C3C",
        fontSize: 14,
        fontWeight: "500",
    },
    contenido: {
        padding: 16,
        paddingBottom: 100,
    },
    tituloSeccion: {
        fontSize: 16,
        fontWeight: "700",
        color: "#0047B8",
        marginBottom: 12,
    },
    campo: {
        marginBottom: 16,
    },
    etiqueta: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 6,
    },
    input: {
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: "#333",
    },
    inputMultiline: {
        textAlignVertical: "top",
        paddingTop: 10,
    },
    botonSeleccionarImagen: {
        backgroundColor: "#E3F2FD",
        borderWidth: 2,
        borderColor: "#0047B8",
        borderRadius: 6,
        padding: 16,
        alignItems: "center",
        marginBottom: 12,
    },
    textoBotonImagen: {
        color: "#0047B8",
        fontSize: 14,
        fontWeight: "600",
    },
    textoChico: {
        color: "#666",
        fontSize: 12,
        marginTop: 4,
    },
    textoImagen: {
        fontSize: 12,
        color: "#0047B8",
        fontWeight: "500",
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#FFF",
        borderTopWidth: 1,
        borderTopColor: "#EEE",
        gap: 12,
    },
    botonCancelar: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#DDD",
        alignItems: "center",
    },
    textoBotonCancelar: {
        color: "#666",
        fontSize: 14,
        fontWeight: "600",
    },
    botonGuardar: {
        flex: 1,
        backgroundColor: "#00AA00",
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: "center",
    },
    botonDeshabilitado: {
        opacity: 0.6,
    },
    textoBotonGuardar: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "700",
    },
});
