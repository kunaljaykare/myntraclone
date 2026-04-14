import React, { createContext, use, useEffect, useState} from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LightTheme, DarkTheme} from "../theme";

export const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
    const deviceTheme = Appearance.getColorScheme();
    const [theme, setTheme] = useState(
        deviceTheme === "dark" ? DarkTheme : LightTheme
    );

    useEffect(() => {
        (async () => {
         const saved = await AsyncStorage.getItem("APP_THEME");   
         if (saved) {
            setTheme(saved === "dark" ? DarkTheme : LightTheme);
         }
        }) ();
    }, []);

    const toggleTheme = async () => {
        const newTheme = theme.mode === "light" ? DarkTheme : LightTheme;
        setTheme(newTheme);
        await AsyncStorage.setItem("APP_THEME", newTheme.mode);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};