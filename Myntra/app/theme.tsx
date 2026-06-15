import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";

type ThemeMode = "system" | "light" | "dark";

export default function ThemeSettingsScreen() {
    const { themeMode, activeTheme, saveTheme } = useTheme();

    const colors =
        activeTheme === "dark"
            ? {
                background: "#121212",
                text: "#FFFFFF",
                border: "#333333",
            }
            : {
                background: "#FFFFFF",
                text: "#111111",
                border: "#DDDDDD",
            };

    const options: {
        label: string;
        value: ThemeMode;
    }[] = [
            { label: "System", value: "system" },
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
        ];

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: colors.background },
            ]}
        >
            <Text
                style={[
                    styles.title,
                    { color: colors.text },
                ]}
            >
                Theme
            </Text>

            {options.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={[
                        styles.option,
                        {
                            borderColor:
                                themeMode === option.value
                                    ? "#FF3F6C"
                                    : colors.border,
                        },
                    ]}
                    onPress={() => saveTheme(option.value)}
                >
                    <Text
                        style={[
                            styles.optionText,
                            { color: colors.text },
                        ]}
                    >
                        {option.label}
                    </Text>

                    {themeMode === option.value && (
                        <Text style={styles.checkmark}>✓</Text>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 20,
    },
    option: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    optionText: {
        fontSize: 16,
    },
    checkmark: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF3F6C",
    },
});