import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { SportsCard } from "../types/card";
import { deleteCard, getCardById, refreshValuation } from "../services/storageService";
import { formatCurrency } from "../services/pricingService";
import { colors, radius, spacing } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "CardDetail">;

export default function CardDetailScreen({ route, navigation }: Props) {
  const { cardId } = route.params;
  const [card, setCard] = useState<SportsCard | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const c = await getCardById(cardId);
    setCard(c ?? null);
  }, [cardId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (!card) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Card not found.</Text>
      </View>
    );
  }

  const handleRefreshValue = async () => {
    setRefreshing(true);
    const updated = await refreshValuation(card.id);
    if (updated) setCard(updated);
    setRefreshing(false);
  };

  const handleDelete = () => {
    Alert.alert("Delete card?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteCard(card.id);
          navigation.navigate("Collection");
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <View style={styles.photoWrap}>
        {card.imageUri ? (
          <Image source={{ uri: card.imageUri }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]}>
            <Text style={styles.photoPlaceholderText}>No photo saved</Text>
          </View>
        )}
      </View>

      {/* Value shown directly alongside the card's photo */}
      <View style={styles.valueCard}>
        <View>
          <Text style={styles.valueLabel}>Estimated Value</Text>
          <Text style={styles.valueAmount}>{formatCurrency(card.estimatedValue)}</Text>
          {card.quantity > 1 && (
            <Text style={styles.valueSub}>
              {formatCurrency(card.estimatedValue * card.quantity)} total for {card.quantity}
            </Text>
          )}
          <Text style={styles.valueUpdated}>
            Updated {new Date(card.lastValuedAt).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={handleRefreshValue}>
          <Text style={styles.refreshBtnText}>{refreshing ? "..." : "Refresh"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>
        {card.year} {card.playerName}
      </Text>
      <Text style={styles.subtitle}>
        {card.brand} {card.setName} #{card.cardNumber}
        {card.parallel ? ` · ${card.parallel}` : ""}
      </Text>

      <View style={styles.detailGrid}>
        <DetailRow label="Sport" value={card.sport || "—"} />
        <DetailRow
          label="Condition"
          value={
            card.isGraded && card.gradingCompany
              ? `${card.gradingCompany} ${card.gradeValue ?? ""}`
              : card.condition
          }
        />
        <DetailRow label="Quantity" value={String(card.quantity)} />
        <DetailRow
          label="Purchase Price"
          value={card.purchasePrice ? formatCurrency(card.purchasePrice) : "—"}
        />
        <DetailRow label="Added" value={new Date(card.dateAdded).toLocaleDateString()} />
        {card.notes ? <DetailRow label="Notes" value={card.notes} /> : null}
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>Delete Card</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  notFound: { color: colors.textMuted, textAlign: "center", marginTop: spacing.xl },
  photoWrap: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  photo: {
    width: 220,
    height: 308,
    borderRadius: radius.lg,
    resizeMode: "cover",
    backgroundColor: colors.surface,
  },
  photoPlaceholder: { alignItems: "center", justifyContent: "center" },
  photoPlaceholderText: { color: colors.textMuted },
  valueCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  valueLabel: { color: colors.textMuted, fontSize: 12, marginBottom: 2 },
  valueAmount: { color: colors.accent, fontSize: 26, fontWeight: "800" },
  valueSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  valueUpdated: { color: colors.textMuted, fontSize: 10, marginTop: 6, opacity: 0.7 },
  refreshBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  refreshBtnText: { color: colors.primary, fontSize: 12, fontWeight: "700" },
  title: { color: colors.text, fontSize: 20, fontWeight: "800" },
  subtitle: { color: colors.textMuted, fontSize: 13, marginTop: 2, marginBottom: spacing.md },
  detailGrid: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  detailLabel: { color: colors.textMuted, fontSize: 13 },
  detailValue: { color: colors.text, fontSize: 13, fontWeight: "600", maxWidth: "60%", textAlign: "right" },
  deleteBtn: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.full,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  deleteBtnText: { color: colors.danger, fontWeight: "700" },
});
