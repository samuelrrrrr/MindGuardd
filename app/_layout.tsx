import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { C } from '../constants/Colors';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Override defaultProps for Text and TextInput to apply the custom font globally
type CustomProps = {
  style?: any;
};

const TextHack = Text as unknown as { defaultProps: CustomProps };
TextHack.defaultProps = TextHack.defaultProps || {};
TextHack.defaultProps.style = [
  TextHack.defaultProps.style,
  { fontFamily: 'PlusJakartaSans_400Regular' },
];

const TextInputHack = TextInput as unknown as { defaultProps: CustomProps };
TextInputHack.defaultProps = TextInputHack.defaultProps || {};
TextInputHack.defaultProps.style = [
  TextInputHack.defaultProps.style,
  { fontFamily: 'PlusJakartaSans_400Regular' },
];

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.navyDeep }}>
      {/* Mengatur warna teks indikator baterai/sinyal menjadi terang (putih) */}
      <StatusBar style="light" />
      
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: C.bg } // Warna latar belakang dasar halaman
        }} 
      />
    </View>
  );
}
