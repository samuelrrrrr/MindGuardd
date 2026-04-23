import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../components/Icon";

const { width, height } = Dimensions.get("window");

const ONBOARDING_DATA = [
  {
    id: "1",
    title: "Shop and Earn points",
    description:
      "Earn points by following a link and purchasing online or by registering your payment card and choosing in store offers.",
    // Nanti ganti require ini dengan path fotomu sendiri, misalnya require('../assets/images/foto1.png')
    image: require("../assets/images/asistant.png"),
  },
  {
    id: "2",
    title: "Exchange Points for Offers",
    description:
      "Choose to swap your points from a marketplace of offers, gift cards or products to gain real value from your shop.",
    // Foto untuk halaman 2
    image: require("../assets/images/asistant.png"),
  },
  {
    id: "3",
    title: "Swap your points for Bitcoin",
    description:
      "Exchange your points for the worlds most popular digital currency and enter the world of crypto.",
    // Foto untuk halaman 3
    image: require("../assets/images/asistant.png"),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Navigate to tabs when done
      router.replace("/(tabs)");
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={[styles.slide, { width }]}>
        {/* TOP GRAPHIC AREA */}
        <View style={styles.graphicArea}>
          {/* Menampilkan gambar sesuai slide yang aktif */}
          <Image
            source={item.image}
            style={styles.graphicImage}
            resizeMode="contain"
          />
        </View>

        {/* BOTTOM CARD */}
        <View style={styles.cardArea}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.bgGreen} />
      <FlatList
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      {/* PAGINATION & BUTTON (Floating over the card) */}
      <View
        style={[styles.bottomControls, { paddingBottom: insets.bottom || 24 }]}
      >
        <View style={styles.pagination}>
          {ONBOARDING_DATA.map((_, i) => {
            const opacity = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });
            const dotWidth = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [6, 18, 6],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={i.toString()}
                style={[styles.dot, { width: dotWidth, opacity }]}
              />
            );
          })}
        </View>
        <TouchableOpacity style={styles.nextBtn} onPress={scrollToNext}>
          <Icon n="arrow" s={20} c="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bgGreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.65,
    backgroundColor: "#12175e", // A shade matching the provided image
  },
  slide: {
    flex: 1,
  },
  graphicArea: {
    height: height * 0.65,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  graphicImage: {
    width: "80%",
    height: "60%",
  },
  cardArea: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 40,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 22,
    fontWeight: "400",
    textAlign: "center",
  },
  bottomControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 16,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#12175e",
  },
  nextBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#12175e",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#12175e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
