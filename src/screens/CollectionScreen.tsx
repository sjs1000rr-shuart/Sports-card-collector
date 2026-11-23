import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { SportsCard } from "../types/card";
import { getAllCards } from "../services/storageService";
import CardListItem from "../components/CardListItem";
import StatsHeader from "../components/StatsHeader";
import { colors, radius, spacing } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Collection">;

export default function CollectionScreen({ navigation }: Props) {
  const [cards, setCards] = useState<SportsCard[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const all = await getAllCards();
    setCards(all);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return cards;
    const q = query.trim().toLowerCase();
    return cards.filter(
      (c) =>
        c.playerName.toLowerCase().includes(q) ||
        c.setName.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.sport.toLowerCase().includes(q)
    );
  }, [cards, query]);

  const totalValue = useMemo(
    () => cards.reduce((sum, c) => sum + c.estimatedValue * c.quantity, 0),
    [cards]
  );
  const cardCount = useMemo(
    () => cards.reduce((sum, c) => sum + c.quantity, 0),
    [cards]
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>My Collection</Text>
        <TouchableOpacity
          style={styles.importExportBtn}
          onPress={() => navigation.navigate("ImportExport")}
        >
          <Text style={styles.importExportBtnText}>Import / Export</Text>
        </TouchableOpacity>
      </View>

      <StatsHeader
        totalValue={totalValue}
        cardCount={cardCount}
        uniqueCount={cards.length}
      />

      <TextInput
        style={styles.search}
        placeholder="Search player, set, brand, sport..."
        placeholderTextColor={colors.textMuted}
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardListItem
            card={item}
            onPress={() => navigation.navigate("CardDetail", { cardId: item.id })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No cards yet</Text>
              <Text style={styles.emptyText}>
                Scan a card or add one manually to start your collection.
              </Text>
            </View>
          ) : null
        }
      />

      <View style={styles.fabRow}>
        <TouchableOpacity
          style={[styles.fab, styles.fabSecondary]}
          onPress={() => navigation.navigate("AddCard", {})}
        >
          <Text style={styles.fabTextSecondary}>+ Add Manually</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("ScanCard")}
        >
          <Text style={styles.fabText}>📷 Scan Card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
  },
  importExportBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  importExportBtnText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  search: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.text,
    marginBottom: spacing.md,
  },
  empty: {
    alignItems: "center",
    marginTop: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center",
  },
  fabRow: {
    position: "absolute",
    bottom: spacing.lg,
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },
  fab: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  fabSecondary: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fabText: {
    color: "#0F172A",
    fontWeight: "800",
    fontSize: 14,
  },
  fabTextSecondary: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 14,
  },
});
