// src/styles/globalStyles.ts
import { StyleSheet } from "react-native";
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

  // TARJETAS
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadows.medium,
  },

  cardTop: {
    height: 100,
    backgroundColor: "#6A5ACD",
  },

  cardContent: {
    padding: spacing.md,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  cardName: {
    fontSize: fontSize.md,
    fontWeight: "bold",
    color: colors.textPrimary,
  },

  cardPrice: {
    fontSize: fontSize.md,
    fontWeight: "bold",
    color: colors.primary,
  },

  cardPromo: {
    backgroundColor: "#d4f4dd",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },

  cardPromoText: {
    color: "#2a7f3e",
    fontWeight: "bold",
  },

  cardDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 8,
  },

  cardDetails: {
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },

  cardDetail: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },

  cardButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },

  cardButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },

  // HEADER
  header: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    paddingBottom: 64,
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
  },

  searchButton: {
    backgroundColor: colors.primary,
    marginLeft: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },

  searchButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
  },

  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: "bold",
    color: colors.textPrimary,
    margin: spacing.md,
  },
});
