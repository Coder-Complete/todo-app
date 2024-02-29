import { getLocalStorage, setLocalStorage } from "../utils/localStorage";

export default class ThemeManager {
  static DATA_KEY = "theme";
  static Themes = {
    LIGHT: "light-theme",
    DARK: "dark-theme",
  };

  constructor() {
    this.current =
      getLocalStorage(ThemeManager.DATA_KEY) || ThemeManager.Themes.LIGHT;
  }

  apply = () => {
    document.body.className = this.current;
  };

  toggle = () => {
    this.current =
      this.current === ThemeManager.Themes.LIGHT
        ? ThemeManager.Themes.DARK
        : ThemeManager.Themes.LIGHT;
    setLocalStorage(ThemeManager.DATA_KEY, this.current);
    this.apply();
  };
}
