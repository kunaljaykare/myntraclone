import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Heart, ShoppingBag } from "lucide-react-native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { addRecentlyViewed } from "@/utils/recentlyViewed";

import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoScrollTimer = useRef<number | null>(null);
  const { user } = useAuth();
  const [product, setproduct] = useState<any>(null);
  const [iswishlist, setiswishlist] = useState(false);
  useEffect(() => {
    // Simulate loading time

    const fetchproduct = async () => {
      try {
        setIsLoading(true);
        const product = await axios.get(
          `https://myntraclone-7ekz.onrender.com/product/${id}`
        );
        setproduct(product.data);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchproduct();
  }, []);
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user || !id) return;

      try {
        const res = await axios.get(
          `https://myntraclone-7ekz.onrender.com/wishlist/${user._id}`
        );

        const exists = res.data.some(
          (item: any) => item.productId._id === id
        );

        setiswishlist(exists);
      } catch (error) {
        console.log(error);
      }
    };

    checkWishlist();
  }, [user, id]);

  // Recently viewed – PERFECT, keep as it is
  useEffect(() => {
    if (product) {
      addRecentlyViewed({
        _id: product._id,
        title: product.name,
        image: product.images[0],
        price: product.price,
      });
    }
  }, [product]);

  // ✅ SAFE auto-scroll implementation
  useEffect(() => {
    if (!product?.images?.length) return;

    autoScrollTimer.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % product.images.length;

        scrollViewRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });

        return nextIndex;
      });
    }, 3000);

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [product, width]);


  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }
  const handleAddwishlist = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      if (iswishlist) {
        await axios.delete(
          `https://myntraclone-7ekz.onrender.com/wishlist/${user._id}/${id}`
        );
        setiswishlist(false);
      } else {
        await axios.post("https://myntraclone-7ekz.onrender.com/wishlist", {
          userId: user._id,
          productId: id,
        });
        setiswishlist(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToBag = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!selectedSize) {
      Alert.alert("Select Size", "Please select a size before adding to bag");
      return;
    }
    try {
      setLoading(true);
      await axios.post("https://myntraclone-7ekz.onrender.com/bag", {
        userId: user._id,
        productId: id,
        size: selectedSize,
        quantity: 1,
      });

      Alert.alert(
        "Added to Bag 🛍️",
        "Item has been added successfully",
        [
          {
            text: "Go to Bag",
            onPress: () => router.replace("/bag"),
          },
          {
            text: "Continue Shopping",
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Item already in bag or something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const imageIndex = Math.round(contentOffset.x / width);
    setCurrentImageIndex(imageIndex);

    // Reset auto-scroll timer when user manually scrolls
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff3f6c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {product.images.map((image: any, index: any) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={[styles.productImage, { width }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {product.images.map((_: any, index: any) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentImageIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.brand}>{product.brand}</Text>
              <Text style={styles.name}>{product.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.wishlistButton}
              onPress={handleAddwishlist}
            >
              <Heart
                size={24}
                color={iswishlist ? "#ff3f6c" : "#ccc"}
                fill={iswishlist ? "#ff3f6c" : "none"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{product.price}</Text>
            <Text style={styles.discount}>{product.discount}</Text>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.sizeSection}>
            <Text style={styles.sizeTitle}>Select Size</Text>
            <View style={styles.sizeGrid}>
              {product.sizes.map((size: any) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    selectedSize === size && styles.selectedSize,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === size && styles.selectedSizeText,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addToBagButton}
          onPress={handleAddToBag}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ff3f6c" />
          ) : (
            <>
              <ShoppingBag size={20} color="#fff" />
              <Text style={styles.addToBagText}>ADD TO BAG</Text>
            </>
          )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  carouselContainer: {
    position: "relative",
  },
  productImage: {
    height: 400,
  },
  pagination: {
    position: "absolute",
    bottom: 16,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#fff",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brand: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3e3e3e",
    marginBottom: 10,
  },
  wishlistButton: {
    padding: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3e3e3e",
    marginRight: 10,
  },
  discount: {
    fontSize: 16,
    color: "#ff3f6c",
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 20,
  },
  sizeSection: {
    marginBottom: 20,
  },
  sizeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3e3e3e",
    marginBottom: 10,
  },
  sizeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  sizeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedSize: {
    borderColor: "#ff3f6c",
    backgroundColor: "#fff4f4",
  },
  sizeText: {
    fontSize: 16,
    color: "#3e3e3e",
  },
  selectedSizeText: {
    color: "#ff3f6c",
  },
  footer: {
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  addToBagButton: {
    backgroundColor: "#ff3f6c",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  addToBagText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
