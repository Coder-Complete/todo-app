import { modeIcon } from "../utils/domElements";

class ThemeManager {
  static LIGHT = "light-theme";
  static DARK = "dark-theme";
  static DATA_KEY = "theme";

  constructor() {
    this.current = this.getThemeFromDatabase();
  }

  getThemeFromDatabase() {
    // contacts database asking for theme, and receives the theme
    return localStorage.getItem(ThemeManager.DATA_KEY) || ThemeManager.LIGHT;
  }

  initialize() {
    document.body.className = this.current;
    this.setupEventListeners();
  }

  setupEventListeners() {
    modeIcon.addEventListener("click", (event) => this.toggle());
  }

  toggle() {
    this.current =
      this.current === ThemeManager.LIGHT
        ? ThemeManager.DARK
        : ThemeManager.LIGHT;
    document.body.className = this.current;
    localStorage.setItem(ThemeManager.DATA_KEY, this.current);
  }
}

export default new ThemeManager();
