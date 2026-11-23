import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CollectionScreen from "../screens/CollectionScreen";
import ScanCardScreen from "../screens/ScanCardScreen";
import AddCardScreen from "../screens/AddCardScreen";
import CardDetailScreen from "../screens/CardDetailScreen";
import ImportExportScreen from "../screens/ImportExportScreen";
import { colors } from "../theme/theme";

export type RootStackParamList = {
  Collection: undefined;
  ScanCard: undefined;
  AddCard: { imageUri?: string } | undefined;
  CardDetail: { cardId: string };
  ImportExport: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Collection"
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Collection"
          component={CollectionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ScanCard"
          component={ScanCardScreen}
          options={{ title: "Scan Card", headerShown: false }}
        />
        <Stack.Screen
          name="AddCard"
          component={AddCardScreen}
          options={{ title: "Add Card" }}
        />
        <Stack.Screen
          name="CardDetail"
          component={CardDetailScreen}
          options={{ title: "Card Details" }}
        />
        <Stack.Screen
          name="ImportExport"
          component={ImportExportScreen}
          options={{ title: "Import / Export" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
