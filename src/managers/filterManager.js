import { filters } from "../utils/domElements";

export class FilterManager {
  static Filters = {
    ALL: "all",
    ACTIVE: "active",
    COMPLETED: "completed",
  };
  static ClassNames = {
    SELECTED: "selected",
  };
  static DATA_KEY = "filter";

  constructor() {
    this.current = this.getFilterFromDatabase();
  }

  applyChange() {
    localStorage.setItem(FilterManager.DATA_KEY, this.current);
    this.updateFilterUI();
    this.renderTodos();
  }

  getFilterFromDatabase() {
    // contacts database asking for theme, and receives the theme
    return (
      localStorage.getItem(FilterManager.DATA_KEY) || FilterManager.Filters.ALL
    );
  }

  initialize() {
    this.setupEventListeners();
    this.updateFilterUI();
  }

  setRenderTodos(todoManagerRenderTodos) {
    this.renderTodos = todoManagerRenderTodos;
  }

  setupEventListeners() {
    filters.forEach((filter) => {
      filter.addEventListener("click", (event) => this.switch(event));
    });
  }

  switch(event) {
    let clickedFilter = event.target.innerText.toLowerCase();
    if (clickedFilter !== this.current) {
      this.current = clickedFilter;
      this.applyChange();
    }
  }

  updateFilterUI() {
    filters.forEach((filter) => {
      if (filter.innerText.toLowerCase() === this.current) {
        filter.classList.add(FilterManager.ClassNames.SELECTED);
      } else {
        filter.classList.remove(FilterManager.ClassNames.SELECTED);
      }
    });
  }
}

export default new FilterManager();
