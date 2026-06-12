import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();

        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } =
                await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            alert("Permission for push notifications not granted!");
            return null;
        }

        try {
            token = (
                await Notifications.getExpoPushTokenAsync()
            ).data;
        } catch (error) {
            console.log("Token error:", error);
            return null;
        }

        console.log("Push notification token:", token);
    } else {
        alert("Must use physical device for Push Notifications");
        return null;
    }

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
        });
    }

    return token;
}