import { modeIcon } from "../utils/domNodes";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
class ThemeManager {
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

  setupEventListeners = () => {
    modeIcon.addEventListener("click", (event) => {
      this.toggle();
    });
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

export const themeManager = new ThemeManager();
