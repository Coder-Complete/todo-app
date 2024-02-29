const modeIcon = document.querySelector(".mode-icon");
const createTodoForm = document.querySelector("#create-todo-form");
const newTodoTextInput = document.querySelector("#new-todo-input");
const todoContainer = document.querySelector(".todo-container");
const todos = document.querySelectorAll(".todo");
const deleteButtons = document.querySelectorAll(".delete-button");
const clearCompletedButton = document.querySelector(".clear-completed-button");
const itemsLeftPlaceholder = document.querySelector(".items-left");
const filters = document.querySelectorAll(".filter");

function generateUUID() {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
}

function textNotEmpty(text) {
  return text.trim().length > 0;
}

function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Invalid JSON");
    return data;
  }
}

function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

const deleteButton = {
  classNames: {
    BUTTON: "delete-button",
    IMAGE: "delete-image",
  },
  clicked(event) {
    return (
      event.target.classList.contains(this.classNames.BUTTON) ||
      event.target.classList.contains(this.classNames.IMAGE)
    );
  },
};

const images = {
  cross: { path: "images/icon-cross.svg", altText: "" },
};
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

  toggle = () => {
    this.current =
      this.current === ThemeManager.Themes.LIGHT
        ? ThemeManager.Themes.DARK
        : ThemeManager.Themes.LIGHT;
    setLocalStorage(ThemeManager.DATA_KEY, this.current);
    this.apply();
  };
}

class FilterManager {
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
    this.current = getLocalStorage("filter") || FilterManager.ALL;
  }

  apply = () => {
    setLocalStorage(FilterManager.DATA_KEY, this.current);
    this.updateFilterUI();
    todoManager.renderTodos();
  };

  getFilterNameFromDomNode = (node) => {
    return node.innerText.toLowerCase();
  };

  initialApply = () => {
    this.updateFilterUI();
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

class TodoManager {
  static DATA_KEY = "todos";
  static ClassNames = {
    BASE: ["bar", "todo"],
    COMPLETED: "completed",
    TEXT: "todo-text",
    CIRCLE: "circle",
  };

  constructor() {
    this.data = getLocalStorage(TodoManager.DATA_KEY) || [];
  }

  add = (text) => {
    this.data.unshift({
      id: generateUUID(),
      text: text,
      completed: false,
    });
    this.apply();
  };

  apply = () => {
    setLocalStorage(TodoManager.DATA_KEY, this.data);
    this.updateItemsLeft();
    this.renderTodos();
  };

  clearCompleted = () => {
    this.data = this.getActiveTodos();
    this.apply();
  };

  click = (event, todo) => {
    if (deleteButton.clicked(event)) {
      this.removeTodoByID(todo.id);
    } else {
      this.toggleTodoByID(todo.id);
    }
  };

  createTodo = (todoData) => {
    let newTodo = document.createElement("div");
    newTodo.id = todoData.id;
    newTodo.classList.add(...TodoManager.ClassNames.BASE);
    if (todoData.completed) {
      newTodo.classList.add(TodoManager.ClassNames.COMPLETED);
    }
    newTodo.innerHTML = `
      <span class="${TodoManager.ClassNames.CIRCLE}"></span>
      <span class="${TodoManager.ClassNames.TEXT}">${todoData.text}</span>
      <span class="${deleteButton.classNames.BUTTON}">
        <img class="${deleteButton.classNames.IMAGE}" src="${images.cross.path}" alt="${images.cross.altText}"/>
      </span>
    `;
    newTodo.addEventListener("click", (event) => this.click(event, newTodo));
    return newTodo;
  };

  findTodoByID = (todoID) =>
    this.data.find((todoData) => todoData.id === todoID);

  getActiveTodos = () => this.data.filter((item) => !item.completed);

  getCompletedTodos = () => this.data.filter((item) => item.completed);

  getTodoListBasedOnFilter = () =>
    filterManager.current === FilterManager.Filters.ACTIVE
      ? this.getActiveTodos()
      : filterManager.current === FilterManager.Filters.COMPLETED
      ? this.getCompletedTodos()
      : this.data;

  initialApply = () => {
    this.updateItemsLeft();
    this.renderTodos();
  };

  removeTodoByID = (todoID) => {
    this.data = this.data.filter((todoData) => todoData.id !== todoID);
    this.apply();
  };

  renderTodos = () => {
    todoContainer.innerHTML = "";
    let todosList = this.getTodoListBasedOnFilter();
    todosList.forEach((todoData) => {
      let newTodo = this.createTodo(todoData);
      todoContainer.append(newTodo);
    });
  };

  toggleTodoByID = (todoID) => {
    const clickedTodoData = this.findTodoByID(todoID);
    clickedTodoData.completed = !clickedTodoData.completed;
    this.apply();
  };

  updateItemsLeft = () => {
    const itemsLeft = this.getActiveTodos().length;
    itemsLeftPlaceholder.innerText = itemsLeft;
  };
}

function setupEventListeners() {
  modeIcon.addEventListener("click", (event) => {
    themeManager.toggle();
  });

  filters.forEach(function (filter) {
    filter.addEventListener("click", (event) => {
      const clickedFilterName = filterManager.getFilterNameFromDomNode(
        event.target
      );
      filterManager.switch(clickedFilterName);
    });
  });

  createTodoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newTodoText = newTodoTextInput.value;
    if (textNotEmpty(newTodoText)) {
      todoManager.add(newTodoText);
    }
    createTodoForm.reset();
  });

  todos.forEach((todo) =>
    todo.addEventListener("click", function (event) {
      todoManager.click(event, todo);
    })
  );

  clearCompletedButton.addEventListener("click", (event) => {
    todoManager.clearCompleted();
  });
}

let themeManager = new ThemeManager();
let filterManager = new FilterManager();
let todoManager = new TodoManager();

themeManager.apply();
filterManager.initialApply();
todoManager.initialApply();

setupEventListeners();
