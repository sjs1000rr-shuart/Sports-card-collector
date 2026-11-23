import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { colors, radius, spacing } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "ScanCard">;

/**
 * NOTE ON "SCANNING": This captures a photo of the card with the device
 * camera and carries it into the Add Card form as the card's image, pre-
 * filling nothing else. True auto-recognition (reading player/set/year off
 * the card automatically) needs an OCR/image-recognition model behind an
 * API — there's a clearly marked spot in AddCardScreen.tsx to wire that in
 * later (e.g. a Claude vision call, or a dedicated card-ID API).
 */
export default function ScanCardScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing] = useState<"back" | "front">("back");
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.permissionText}>
          Camera access is needed to scan cards.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Grant Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (photo?.uri) {
      navigation.replace("AddCard", { imageUri: photo.uri });
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.overlay}>
          <View style={styles.frame} />
          <Text style={styles.hint}>Line the card up within the frame</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shutterBtn} onPress={takePhoto}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>
          <View style={{ width: 70 }} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  centered: { alignItems: "center", justifyContent: "center", padding: spacing.lg },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    width: "78%",
    aspectRatio: 2.5 / 3.5, // standard trading card ratio
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: radius.md,
  },
  hint: {
    color: "#fff",
    marginTop: spacing.md,
    fontSize: 13,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  cancelBtn: { width: 70 },
  cancelBtnText: { color: "#fff", fontSize: 14 },
  shutterBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#fff",
  },
  permissionText: {
    color: colors.text,
    fontSize: 15,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  permissionBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: radius.full,
  },
  permissionBtnText: { color: "#0F172A", fontWeight: "700" },
});
