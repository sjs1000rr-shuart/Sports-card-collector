import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { CardCondition, NewCardInput } from "../types/card";
import { addCard } from "../services/storageService";
import { colors, radius, spacing } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "AddCard">;

const CONDITIONS: CardCondition[] = [
  "Gem Mint 10",
  "Mint 9",
  "Near Mint 8",
  "Excellent 6-7",
  "Good 4-5",
  "Poor 1-3",
  "Ungraded",
];

export default function AddCardScreen({ route, navigation }: Props) {
  const initialImage = route.params?.imageUri;

  const [imageUri, setImageUri] = useState<string | undefined>(initialImage);
  const [playerName, setPlayerName] = useState("");
  const [year, setYear] = useState("");
  const [brand, setBrand] = useState("");
  const [setName, setSetName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [sport, setSport] = useState("");
  const [condition, setCondition] = useState<CardCondition>("Near Mint 8");
  const [isGraded, setIsGraded] = useState(false);
  const [gradingCompany, setGradingCompany] = useState("");
  const [gradeValue, setGradeValue] = useState("");
  const [parallel, setParallel] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const pickFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Photo library access is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [2.5, 3.5],
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!playerName.trim()) {
      Alert.alert("Missing info", "Player name is required.");
      return;
    }
    setSaving(true);
    try {
      const input: NewCardInput = {
        playerName: playerName.trim(),
        year: year.trim(),
        brand: brand.trim(),
        setName: setName.trim(),
        cardNumber: cardNumber.trim(),
        sport: sport.trim(),
        condition,
        isGraded,
        gradingCompany: isGraded ? gradingCompany.trim() || undefined : undefined,
        gradeValue: isGraded ? gradeValue.trim() || undefined : undefined,
        parallel: parallel.trim() || undefined,
        quantity: parseInt(quantity, 10) || 1,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
        imageUri,
        notes: notes.trim() || undefined,
      };
      await addCard(input);
      navigation.navigate("Collection");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.header}>Add Card</Text>

      <TouchableOpacity style={styles.photoBox} onPress={pickFromLibrary}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>Tap to add a photo</Text>
          </View>
        )}
      </TouchableOpacity>
      {/*
        FUTURE: auto-fill hook. If you wire up an image-recognition/OCR API,
        call it here right after imageUri is set, then setPlayerName/year/etc.
        from the response before the user finishes the rest of the form.
      */}

      <Field label="Player Name *" value={playerName} onChangeText={setPlayerName} />
      <Row>
        <Field label="Year" value={year} onChangeText={setYear} flex={1} keyboardType="number-pad" />
        <Field label="Sport" value={sport} onChangeText={setSport} flex={1} />
      </Row>
      <Row>
        <Field label="Brand" value={brand} onChangeText={setBrand} flex={1} />
        <Field label="Set" value={setName} onChangeText={setSetName} flex={1} />
      </Row>
      <Row>
        <Field label="Card #" value={cardNumber} onChangeText={setCardNumber} flex={1} />
        <Field label="Parallel" value={parallel} onChangeText={setParallel} flex={1} placeholder="e.g. Refractor /50" />
      </Row>

      <Text style={styles.label}>Condition</Text>
      <View style={styles.chipRow}>
        {CONDITIONS.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, condition === c && styles.chipActive]}
            onPress={() => setCondition(c)}
          >
            <Text style={[styles.chipText, condition === c && styles.chipTextActive]}>
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Row style={{ alignItems: "center" }}>
        <Text style={[styles.label, { flex: 1 }]}>Professionally Graded</Text>
        <Switch value={isGraded} onValueChange={setIsGraded} />
      </Row>

      {isGraded && (
        <Row>
          <Field
            label="Grading Co."
            value={gradingCompany}
            onChangeText={setGradingCompany}
            flex={1}
            placeholder="PSA, BGS, SGC"
          />
          <Field label="Grade" value={gradeValue} onChangeText={setGradeValue} flex={1} placeholder="10" />
        </Row>
      )}

      <Row>
        <Field
          label="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          flex={1}
          keyboardType="number-pad"
        />
        <Field
          label="Purchase Price"
          value={purchasePrice}
          onChangeText={setPurchasePrice}
          flex={1}
          keyboardType="decimal-pad"
          placeholder="$"
        />
      </Row>

      <Field label="Notes" value={notes} onChangeText={setNotes} multiline />

      <Text style={styles.disclaimer}>
        Estimated value is calculated automatically using our mock pricing
        model when you save. Real-time market pricing can be connected later.
      </Text>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveBtnText}>
          {saving ? "Saving..." : "Save Card"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Row({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[{ flexDirection: "row", gap: spacing.sm }, style]}>{children}</View>;
}

function Field({
  label,
  value,
  onChangeText,
  flex,
  multiline,
  keyboardType,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  flex?: number;
  multiline?: boolean;
  keyboardType?: any;
  placeholder?: string;
}) {
  return (
    <View style={{ flex, marginBottom: spacing.sm }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: spacing.md,
  },
  photoBox: {
    height: 200,
    borderRadius: radius.md,
    overflow: "hidden",
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  photo: { width: "100%", height: "100%", resizeMode: "cover" },
  photoPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  photoPlaceholderText: { color: colors.textMuted },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "600",
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    color: colors.text,
  },
  inputMultiline: { minHeight: 70, textAlignVertical: "top" },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textMuted, fontSize: 12 },
  chipTextActive: { color: "#0F172A", fontWeight: "700" },
  disclaimer: {
    color: colors.textMuted,
    fontSize: 11,
    marginVertical: spacing.md,
    lineHeight: 16,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  saveBtnText: { color: "#0F172A", fontWeight: "800", fontSize: 15 },
});
