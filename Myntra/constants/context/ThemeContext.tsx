import React, {
    createContext,
    useEffect,
    useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

const THEME_KEY = "APP_THEME";

export type ThemeMode =
    | "light"
    | "dark"
    | "system";

interface ThemeContextType {
    themeMode: ThemeMode;
    activeTheme: "light" | "dark";
    saveTheme: (mode: ThemeMode) => Promise<void>;
}

export const ThemeContext =
    createContext<ThemeContextType | null>(null);

export function ThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const systemTheme = useColorScheme();

    const [themeMode, setThemeMode] =
        useState<ThemeMode>("system");

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const saved =
                await AsyncStorage.getItem(THEME_KEY);

            if (
                saved === "light" ||
                saved === "dark" ||
                saved === "system"
            ) {
                setThemeMode(saved);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const saveTheme = async (
        mode: ThemeMode
    ) => {
        try {
            setThemeMode(mode);
            await AsyncStorage.setItem(
                THEME_KEY,
                mode
            );
        } catch (error) {
            console.error(error);
        }
    };

    const activeTheme: "light" | "dark" =
        themeMode === "system"
            ? systemTheme ?? "light"
            : themeMode;

    return (
        <ThemeContext.Provider
            value={{
                themeMode,
                activeTheme,
                saveTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}