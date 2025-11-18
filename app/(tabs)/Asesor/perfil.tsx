import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { Feather, MaterialIcons } from "@expo/vector-icons"; // Importar MaterialIcons para el icono de Teléfono/Email
import { useRouter } from "expo-router";

// --- Colores y Tamaños ---
const HEADER_BLUE = "#3498DB";
const PRIMARY_BLUE = "#007AFF"; // Para botones y círculos
const DANGER_RED = "#FF3B30"; // Para botón Cerrar Sesión
const BACKGROUND_LAVANDA = "#E6E6FA"; // Fondo suave
const CARD_COLOR = "#FFFFFF";

export default function PerfilTab() {
  const { usuario, logout } = useAuth();
  const router = useRouter();

  if (!usuario) return null;

  const handleLogout = async () => {
    await logout(); // Limpiar estado del usuario
    router.replace("/auth/login"); // Redirigir al login
  };

  // Función Placeholder para la navegación a Edición de Perfil
  const handleEditProfile = () => {
    // Aquí deberías redirigir a la pantalla de edición
    console.log("Navegar a Editar Perfil");
    // router.push('/Asesor/editar-perfil');
    alert("Función Editar Perfil no implementada aún.");
  };
  
  // Renderiza el contenido de la tarjeta de información (Email y Teléfono)
  const InfoCard = ({ iconName, label, value }: { iconName: string, label: string, value: string | undefined }) => (
    <View style={styles.infoCard}>
      <View style={styles.infoRow}>
        <View style={styles.infoIconCircle}>
            {/* Usamos MaterialIcons que tiene un icono de teléfono y un sobre (Email) */}
            <MaterialIcons name={iconName} size={20} color={PRIMARY_BLUE} />
        </View>
        <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
        {/* HEADER (Se simula el header azul fijo de la app) */}
        <View style={styles.header}>
            <View style={styles.tag}>
                <Text style={styles.tagText}>Asesor Comercial</Text>
            </View>
            <Text style={styles.headerTitle}>Mi Perfil</Text>
             {/* Icono de menú simulado */}
            <TouchableOpacity style={styles.menuIconPlaceholder}>
                <Feather name="menu" size={24} color="#fff" />
            </TouchableOpacity>
        </View>


        <View style={styles.contentContainer}>
            {/* Tarjeta Principal de Perfil */}
            <View style={styles.profileCard}>
                {/* Avatar */}
                <View style={styles.avatarCircle}>
                    {/* Nota: En el diseño hay una 'A' dentro. Usaremos Feather user o la primera letra del nombre */}
                    <Text style={styles.avatarText}>{usuario.nombre ? usuario.nombre[0].toUpperCase() : '?'}</Text>
                </View>

                {/* Nombre y Rol */}
                <Text style={styles.nombre}>
                    {usuario.nombre} (<Text style={{fontWeight: 'normal'}}>{usuario.role || 'Rol Desconocido'}</Text>)
                </Text>
                <Text style={styles.subtext}>{usuario.email}</Text>
            </View>

            {/* Tarjetas de Información de Contacto */}
            <View style={styles.contactContainer}>
                {/* Email */}
                <InfoCard 
                    iconName="email" 
                    label="Email" 
                    value={usuario.email} 
                />

                {/* Teléfono */}
                {usuario.telefono && (
                    <InfoCard 
                        iconName="phone-android" 
                        label="Teléfono" 
                        value={usuario.telefono} 
                    />
                )}
            </View>

            {/* Botones de Acción */}
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: BACKGROUND_LAVANDA, 
    },
    // Estilos del Header simulado
    header: {
        backgroundColor: HEADER_BLUE,
        paddingTop: 50, // Espacio superior para la barra de estado
        paddingHorizontal: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
        marginLeft: -30, // Contrarresta el espacio del icono de menú/tag
    },
    menuIconPlaceholder: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tag: {
        backgroundColor: '#00A859', // Verde del tag 'Asesor Comercial'
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        position: 'absolute',
        top: 55, // Posicionamiento relativo al header
        left: 15,
    },
    tagText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
    },
    contentContainer: {
        paddingHorizontal: 20,
        marginTop: -30, // Levantar un poco el contenido sobre el header (si es necesario)
    },
    
    // Estilos de la Tarjeta Principal de Perfil
    profileCard: {
        backgroundColor: CARD_COLOR,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20, // Espacio para bajar la tarjeta desde el header
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: PRIMARY_BLUE,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: CARD_COLOR,
    },
    nombre: { 
        fontSize: 22, 
        fontWeight: "700", 
        marginBottom: 2,
        color: '#333',
    },
    subtext: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    
    // Estilos de las Tarjetas de Contacto
    contactContainer: {
        marginBottom: 30,
    },
    infoCard: {
        backgroundColor: CARD_COLOR,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0F2FF', // Azul muy pálido para el fondo del icono
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    infoContent: {
        flex: 1,
        justifyContent: 'center',
    },
    infoLabel: {
        fontSize: 12,
        color: '#999',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },

    // Estilos de Botones de Acción
    editButton: { 
        paddingVertical: 15, 
        backgroundColor: PRIMARY_BLUE, 
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    editButtonText: { 
        color: "#fff", 
        fontWeight: "bold",
        fontSize: 16,
    },
    logoutButton: { 
        paddingVertical: 15, 
        backgroundColor: DANGER_RED, 
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    logoutText: { 
        color: "#fff", 
        fontWeight: "bold",
        fontSize: 16,
    },
});