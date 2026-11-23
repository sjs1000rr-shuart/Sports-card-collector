import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatCurrency } from "../services/pricingService";
import { colors, radius, spacing } from "../theme/theme";

interface Props {
  totalValue: number;
  cardCount: number;
  uniqueCount: number;
}

export default function StatsHeader({ totalValue, cardCount, uniqueCount }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <Text style={styles.label}>Collection Value</Text>
        <Text style={styles.bigValue}>{formatCurrency(totalValue)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.block}>
        <Text style={styles.label}>Cards</Text>
        <Text style={styles.count}>{cardCount}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.block}>
        <Text style={styles.label}>Unique</Text>
        <Text style={styles.count}>{uniqueCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: "center",
  },
  block: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bigValue: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: "800",
  },
  count: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
});
