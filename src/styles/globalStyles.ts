// src/styles/globalStyles.ts
import { StyleSheet } from "react-native";
// Asumo que estas constantes existen en ./theme
import { borderRadius, colors, fontSize, shadows, spacing } from "./theme"; 

export const globalStyles = StyleSheet.create({
  // CONTENEDORES
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  containerCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
    
    // 🎯 NUEVO: Contenedor de pantalla completa (usado en CatalogoPlanes)
    fullScreenContainer: { 
        flex: 1, 
        backgroundColor: colors.background, // Usamos el color de fondo global
    },
    
    // 🎯 NUEVO: Contenedor con padding para el contenido
    contentContainer: { 
        flex: 1, 
        paddingHorizontal: spacing.md, 
    },

  contentPadding: {
    padding: spacing.md,
  },

  // INPUTS
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },

  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },

  // BOTONES
  button: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.small,
  },

  buttonPrimary: {
    backgroundColor: colors.primary,
  },

  buttonSecondary: {
    backgroundColor: colors.secondary,
  },

  buttonDanger: {
    backgroundColor: colors.danger,
  },

  buttonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: "600",
  },

  // TARJETAS (PLANES)
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadows.medium,
  },

  cardTop: {
    height: 100,
    backgroundColor: colors.secondary, // Usando color secundario de theme
  },

  cardContent: {
    padding: spacing.md,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },

  cardName: {
    fontSize: fontSize.md,
    fontWeight: "bold",
    color: colors.textPrimary,
  },

  cardPrice: {
    fontSize: fontSize.xl, // Precio ligeramente más grande
    fontWeight: "bold",
    color: colors.primary,
  },

  cardPromo: {
    backgroundColor: "#d4f4dd", // Verde claro de ejemplo
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
    borderWidth: 1, 
    borderColor: "#90EE90",
  },

  cardPromoText: {
    color: "#2a7f3e", // Verde oscuro de ejemplo
    fontWeight: "bold",
    fontSize: fontSize.sm,
  },

  cardDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  cardDetails: {
    flexDirection: "row",
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginBottom: spacing.xs,
  },

  cardDetail: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },

  cardButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },

  cardButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: fontSize.md,
  },

  // HEADER
  header: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    paddingBottom: 64, // Da espacio para que el buscador se superponga
  },

  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: colors.white,
  },

  headerSubtitle: {
    fontSize: fontSize.sm,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },

  // SEARCH
  searchContainer: {
    flexDirection: "row",
    marginHorizontal: spacing.md,
    marginTop: -32,
    zIndex: 10,
  },

  searchInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    height: 40,
    elevation: 3,
    ...shadows.small,
  },

  searchButton: {
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },

    // 🎯 NUEVO: Ícono del botón de búsqueda (para el "🔍")
  searchButtonIcon: { 
    color: colors.white,
    fontSize: fontSize.md,
    // Podrías necesitar un tamaño un poco más grande para el ícono
  },

  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: "bold",
    color: colors.textPrimary,
    margin: spacing.md,
  },
});
