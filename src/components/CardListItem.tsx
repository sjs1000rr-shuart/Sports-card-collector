import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { SportsCard } from "../types/card";
import { formatCurrency } from "../services/pricingService";
import { colors, radius, spacing } from "../theme/theme";

interface Props {
  card: SportsCard;
  onPress: () => void;
}

export default function CardListItem({ card, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {card.imageUri ? (
        <Image source={{ uri: card.imageUri }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]}>
          <Text style={styles.thumbPlaceholderText}>No Photo</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {card.year} {card.playerName}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {card.brand} {card.setName} #{card.cardNumber}
          {card.parallel ? ` · ${card.parallel}` : ""}
        </Text>
        <Text style={styles.subtitleMuted} numberOfLines={1}>
          {card.isGraded && card.gradingCompany
            ? `${card.gradingCompany} ${card.gradeValue}`
            : card.condition}
          {card.quantity > 1 ? ` · Qty ${card.quantity}` : ""}
        </Text>
      </View>
      <View style={styles.valueBlock}>
        <Text style={styles.value}>{formatCurrency(card.estimatedValue)}</Text>
        {card.quantity > 1 && (
          <Text style={styles.valueTotal}>
            {formatCurrency(card.estimatedValue * card.quantity)} total
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: "center",
  },
  thumb: {
    width: 56,
    height: 78,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
  },
  thumbPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  thumbPlaceholderText: {
    color: colors.textMuted,
    fontSize: 9,
    textAlign: "center",
  },
  info: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  subtitleMuted: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    opacity: 0.8,
  },
  valueBlock: {
    alignItems: "flex-end",
    marginLeft: spacing.sm,
  },
  value: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: "800",
  },
  valueTotal: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
});
