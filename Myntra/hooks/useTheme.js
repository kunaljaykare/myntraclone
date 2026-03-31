import {use, useContext} from "react";
import { ThemeContext } from "../constants/context/ThemeContext";

export const useTheme = () => useContext(ThemeContext);