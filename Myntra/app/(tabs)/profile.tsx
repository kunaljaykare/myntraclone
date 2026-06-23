import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import {
  User,
  Package,
  Heart,
  CreditCard,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react-native";
import React from "react";
import { useAuth } from "@/constants/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";

const menuItems = [
  { icon: Package, label: "Orders", route: "/orders" },
  { icon: Heart, label: "Wishlist", route: "/wishlist" },
  { icon: CreditCard, label: "Payment Methods", route: "/payments" },
  { icon: MapPin, label: "Addresses", route: "/addresses" },
  { icon: Settings, label: "Settings", route: "/settings" },
];

export default function Profile() {
  const router = useRouter();
  const { user, logout, isAuthenticated, authLoading } = useAuth();
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
  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };
  if (authLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
          <User size={64} color="#ff3f6c" />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Please login to view your profile
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
      </View>

      <ScrollView style={[styles.content, { backgroundColor: colors.background }]}>
        <View style={[styles.userInfo, { backgroundColor: colors.background }]}>
          <View style={styles.avatar}>
            <User size={40} color="#fff" />
          </View>
          <View style={[styles.userDetails, { backgroundColor: colors.background }]}>
            <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
            <Text style={[styles.userEmail, { color: colors.text }]}>{user.email}</Text>
          </View>
        </View>

        <View style={[styles.menuSection, { backgroundColor: colors.background }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: colors.background }]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.menuItemLeft, { backgroundColor: colors.background }]}>
                <item.icon size={24} color="#3e3e3e" />
                <Text style={[styles.menuItemLabel, { color: colors.text }]}>{item.label}</Text>
              </View>
              <ChevronRight size={24} color="#3e3e3e" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.background }]} onPress={handleLogout}>
          <LogOut size={24} color="#ff3f6c" />
          <Text style={[styles.logoutText, { color: colors.text }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ff3f6c",
    justifyContent: "center",
    alignItems: "center",
  },
  userDetails: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3e3e3e",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  menuSection: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemLabel: {
    fontSize: 16,
    color: "#3e3e3e",
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff3f6c",
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#ff3f6c",
    fontWeight: "bold",
  },
});
