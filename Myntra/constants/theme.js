import { model } from "mongoose";

export const LightTheme = {
    model: "light",
    colors : {
        background: "#FFFFFF",
        text: "#000000",
        primary: "ff3f6c",
        card: "ffffff",
        border: "#e0e0e0",
    },
};
export const DarkTheme = {
    model: "dark",
    colors : {
        background: "#121212",
        text: "#FFFFFF",
        primary: "ff3f6c",
        card: "#1e1e1e",
        border: "#333",
    },
};