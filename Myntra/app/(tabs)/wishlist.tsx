import { useAuth } from "@/constants/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import axios from "axios";
import { useRouter } from "expo-router";
import { Heart, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Wishlist() {
  const router = useRouter();
  const { user } = useAuth();
  const [wishlist, setwishlist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
   const { activeTheme } = useTheme();
      const colors =
        activeTheme === "dark"
          ? {
            background: "#121212",
            text: "#FFFFFF",
          }
          : {
            background: "#FFFFFF",
            text: "#111111",
          };
  useEffect(() => {
    fetchproduct();
  }, [user]);
  const fetchproduct = async () => {
    if (user) {
      try {
        setIsLoading(true);
        const bag = await axios.get(
          `https://myntraclone-7ekz.onrender.com/wishlist/${user._id}`
        );
        setwishlist(bag.data);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handledelete=async(itemid:any)=>{
    try {
      await axios.delete(`https://myntraclone-7ekz.onrender.com/wishlist/${itemid}`)
      fetchproduct();
    } catch (error) {
      console.log(error)
    }
   
  }
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Wishlist</Text>
        </View>
        <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
          <Heart size={64} color="#ff3f6c" />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Please login to view your wishlist
          </Text>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.background }]}
            onPress={() => router.push("/login")}
          >
            <Text style={[styles.loginButtonText, { color: colors.text }]}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#ff3f6c" />
      </View>
    );
  }
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Wishlist</Text>
      </View>

      <ScrollView style={[styles.content, { backgroundColor: colors.background }]}>
        {wishlist?.map((item:any) => (
          <View key={item._id} style={[styles.wishlistItem, { backgroundColor: colors.background }]}>
            <Image  source={{ uri: item.productId.images[0] }} style={styles.itemImage} />
            <View style={[styles.itemInfo, { backgroundColor: colors.background }]}>
              <Text style={[styles.brandName, { color: colors.text }]}>{item.productId.brand}</Text>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.productId.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={[styles.price, { color: colors.text }]}>{item.productId.price}</Text>
                <Text style={[styles.discount, { color: colors.text }]}>{item.productId.discount}</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.removeButton, { backgroundColor: colors.background }]} onPress={()=>handledelete(item._id)}>
              <Trash2 size={24} color="#ff3f6c" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 15,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3e3e3e",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    color: "#3e3e3e",
    marginTop: 20,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#ff3f6c",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  wishlistItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  itemImage: {
    width: 100,
    height: 120,
  },
  itemInfo: {
    flex: 1,
    padding: 15,
  },
  brandName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    color: "#3e3e3e",
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3e3e3e",
    marginRight: 10,
  },
  discount: {
    fontSize: 14,
    color: "#ff3f6c",
  },
  removeButton: {
    padding: 15,
    justifyContent: "center",
  },
});
