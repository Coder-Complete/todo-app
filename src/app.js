import { filterManager } from "./managers/filterManager";
import { themeManager } from "./managers/themeManager";
import { todoManager } from "./managers/todoManager";

themeManager.apply();
filterManager.initialApply();
todoManager.initialApply();

themeManager.setupEventListeners();
filterManager.setupEventListeners();
todoManager.setupEventListeners();
