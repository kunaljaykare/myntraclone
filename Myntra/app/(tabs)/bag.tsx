import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function Bag() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [bag, setbag] = useState<any[]>([]);
  useEffect(() => {
    // Simulate loading time
    if (user) {

      fetchproduct();
    }
  }, [user]);
  const fetchproduct = async () => {
    if (user) {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `https://myntraclone-7ekz.onrender.com/bag/${user._id}`
        );
        setbag(res.data);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }
  };
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Bag</Text>
        </View>
        <View style={styles.emptyState}>
          <ShoppingBag size={64} color="#ff3f6c" />
          <Text style={styles.emptyTitle}>Please login to view your bag</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff3f6c" />
      </View>
    );
  }
  
  const activeItems = bag.filter(item => !item.savedForLater);
  const savedItems = bag.filter(item => item.savedForLater);
  const total = activeItems.reduce(
    (sum: any, item: any) => sum + item.productId.price * item.quantity,
    0
  );

  const toggleSaveForLater = async (itemId: string, save: boolean) => {
    try {
      await axios.put(
        `https://myntraclone-7ekz.onrender.com/bag/${itemId}`,
        { savedForLater: save }
      );
      fetchproduct();
    } catch (error) {
      console.log(error);
    }
  };


  const handledelete = async (itemid: any) => {
    try {
      await axios.delete(`https://myntraclone-7ekz.onrender.com/bag/${itemid}`)
      fetchproduct();
    } catch (error) {
      console.log(error)
    }

  }
  const updateQuantity = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;

    try {
      await axios.put(
        `https://myntraclone-7ekz.onrender.com/bag/${itemId}`,
        { quantity: newQty }
      );
      fetchproduct(); // refresh bag
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Bag</Text>
      </View>

      <ScrollView style={styles.content}>
        {activeItems.map((item: any) => (
          <View key={item._id} style={styles.bagItem}>
            <Image
              source={{ uri: item.productId.images[0] }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.brandName}>{item.productId.brand}</Text>
              <Text style={styles.itemName}>{item.productId.name}</Text>
              <Text style={styles.itemSize}>Size: {item.size}</Text>
              <Text style={styles.itemPrice}>₹{item.productId.price}</Text>

              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item._id, item.quantity - 1)}
                >
                  <Minus size={20} color="#3e3e3e" />
                </TouchableOpacity>

                <Text style={styles.quantity}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item._id, item.quantity + 1)}
                >
                  <Plus size={20} color="#3e3e3e" />
                </TouchableOpacity>


              </View>
              <TouchableOpacity
                onPress={() => toggleSaveForLater(item._id, true)}
              >
                <Text style={{ color: "#ff3f6c", marginTop: 10 }}>
                  Save for later
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handledelete(item._id)}
              >
                <Trash2 size={20} color="#ff3f6c" />
              </TouchableOpacity>

            </View>
          </View>
        ))}
        {activeItems.length === 0 && savedItems.length === 0 && (
          <View style={styles.emptyState}>
            <ShoppingBag size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Your bag is empty</Text>
          </View>
        )}

        {savedItems.length > 0 && (
          <View style={{ marginTop: 30 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Saved for Later
            </Text>

            {savedItems.map((item: any) => (
              <View key={item._id} style={styles.bagItem}>
                <Image
                  source={{ uri: item.productId.images[0] }}
                  style={styles.itemImage}
                />

                <View style={styles.itemInfo}>
                  <Text style={styles.brandName}>{item.productId.brand}</Text>
                  <Text style={styles.itemName}>{item.productId.name}</Text>
                  <Text style={styles.itemPrice}>
                    ₹{item.productId.price}
                  </Text>
                  <TouchableOpacity
                    onPress={() => toggleSaveForLater(item._id, false)}
                  >
                    <Text style={{ color: "#ff3f6c", marginTop: 10 }}>
                      Move to Bag
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}


      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>₹{total}</Text>
        </View>
        <TouchableOpacity
          disabled={activeItems.length === 0}
          style={[
            styles.checkoutButton,
            activeItems.length === 0 && { opacity: 0.5 },
          ]}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.checkoutButtonText}>PLACE ORDER</Text>
        </TouchableOpacity>

      </View>
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
  bagItem: {
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
    marginBottom: 5,
  },
  itemSize: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3e3e3e",
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    marginHorizontal: 15,
    fontSize: 16,
  },
  removeButton: {
    marginLeft: "auto",
  },
  footer: {
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: "#3e3e3e",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3e3e3e",
  },
  checkoutButton: {
    backgroundColor: "#ff3f6c",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
