import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { exportCardsToExcel, importCardsFromExcel } from "../services/excelService";
import { bulkAddCards, getAllCards } from "../services/storageService";
import { colors, radius, spacing } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "ImportExport">;

export default function ImportExportScreen({ navigation }: Props) {
  const [busy, setBusy] = useState<"import" | "export" | null>(null);

  const handleImport = async () => {
    setBusy("import");
    try {
      const result = await importCardsFromExcel();
      if (!result) {
        setBusy(null);
        return;
      }
      if (result.cards.length === 0) {
        Alert.alert(
          "Nothing imported",
          "No valid rows found. Make sure there's a 'Player Name' column."
        );
        setBusy(null);
        return;
      }
      await bulkAddCards(result.cards);
      Alert.alert(
        "Import complete",
        `Added ${result.cards.length} card(s).` +
          (result.skippedRows > 0
            ? ` Skipped ${result.skippedRows} row(s) missing a player name.`
            : ""),
        [{ text: "OK", onPress: () => navigation.navigate("Collection") }]
      );
    } catch (err: any) {
      Alert.alert("Import failed", err?.message ?? "Something went wrong.");
    } finally {
      setBusy(null);
    }
  };

  const handleExport = async () => {
    setBusy("export");
    try {
      const cards = await getAllCards();
      if (cards.length === 0) {
        Alert.alert("Nothing to export", "Your collection is empty.");
        return;
      }
      await exportCardsToExcel(cards);
    } catch (err: any) {
      Alert.alert("Export failed", err?.message ?? "Something went wrong.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Import / Export</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Import from Excel</Text>
        <Text style={styles.cardText}>
          Pick an .xlsx, .xls, or .csv file. Expected columns: Player Name
          (required), Year, Brand, Set Name, Card Number, Sport, Condition,
          Is Graded, Grading Company, Grade Value, Parallel, Quantity,
          Purchase Price, Notes. Header names are matched flexibly.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={handleImport} disabled={busy !== null}>
          {busy === "import" ? (
            <ActivityIndicator color="#0F172A" />
          ) : (
            <Text style={styles.btnText}>Choose File to Import</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Export to Excel</Text>
        <Text style={styles.cardText}>
          Generates an .xlsx of your full collection with current estimated
          values, then opens the share sheet so you can save or send it.
          (Card photos are stored on-device and are not embedded in the
          spreadsheet.)
        </Text>
        <TouchableOpacity style={styles.btn} onPress={handleExport} disabled={busy !== null}>
          {busy === "export" ? (
            <ActivityIndicator color="#0F172A" />
          ) : (
            <Text style={styles.btnText}>Export Collection</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { color: colors.text, fontSize: 22, fontWeight: "800", marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: "700", marginBottom: spacing.xs },
  cardText: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginBottom: spacing.md },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnText: { color: "#0F172A", fontWeight: "800" },
});
