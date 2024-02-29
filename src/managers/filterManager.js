import { filters } from "../utils/domNodes";
import { getLocalStorage, setLocalStorage } from "./../utils/localStorage";

export class FilterManager {
  static DATA_KEY = "filter";
  static Filters = {
    ALL: "all",
    ACTIVE: "active",
    COMPLETED: "completed",
  };
  static ClassNames = {
    SELECTED: "selected",
  };

  constructor() {
    this.current = getLocalStorage("filter") || FilterManager.Filters.ALL;
    this.renderTodos = () => {}; // will be replaced by todoManager's renderTodos method in its constructor
  }

  apply = () => {
    setLocalStorage(FilterManager.DATA_KEY, this.current);
    this.updateFilterUI();
    this.renderTodos();
  };

  getFilterNameFromDomNode = (node) => node.innerText.toLowerCase();

  initialApply = () => {
    this.updateFilterUI();
  };

  setRenderTodos = (renderTodosFromTodoManager) => {
    this.renderTodos = renderTodosFromTodoManager;
  };

  setupEventListeners = () => {
    filters.forEach((filter) => {
      filter.addEventListener("click", (event) => {
        const clickedFilterName = this.getFilterNameFromDomNode(event.target);
        this.switch(clickedFilterName);
      });
    });
  };

  switch = (clickedFilterName) => {
    if (clickedFilterName !== this.current) {
      this.current = clickedFilterName;
      this.apply();
    }
  };

  updateFilterUI = () => {
    filters.forEach((filter) => {
      if (this.getFilterNameFromDomNode(filter) === this.current) {
        filter.classList.add(FilterManager.ClassNames.SELECTED);
      } else {
        filter.classList.remove(FilterManager.ClassNames.SELECTED);
      }
    });
  };
}

export const filterManager = new FilterManager();
