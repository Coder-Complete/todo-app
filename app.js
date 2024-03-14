const modeIcon = document.querySelector(".mode-icon");
const createTodoForm = document.querySelector("#create-todo-form");
const newTodoTextInput = document.querySelector("#new-todo-input");
const todoContainer = document.querySelector(".todo-container");
const todos = document.querySelectorAll(".todo");
const deleteButtons = document.querySelectorAll(".delete-button");
const clearCompletedButton = document.querySelector(".clear-completed-button");
const itemsLeftPlaceholder = document.querySelector(".items-left");
const filters = document.querySelectorAll(".filter");

const DataKeys = {
  TODOS: "todos",
  FILTER: "filter",
};
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

const themeManager = new ThemeManager();
themeManager.initialize();

const Filters = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
};

const ClassNames = {
  todo: {
    BASE: ["bar", "todo"],
    COMPLETED: "completed",
    CIRCLE: "circle",
    DELETE_BUTTON: "delete-button",
    DELETE_IMAGE: "delete-image",
    TEXT: "todo-text",
  },
  filter: {
    SELECTED: "selected",
  },
};

const Images = {
  cross: {
    path: "images/icon-cross.svg",
    altText: "",
  },
};

const DeleteButton = {
  classNames: {
    DELETE_BUTTON: "delete-button",
    DELETE_IMAGE: "delete-image",
  },
  image: {
    path: "images/icon-cross.svg",
    altText: "",
  },
  clicked(event) {
    return (
      event.target.classList.contains(this.classNames.DELETE_BUTTON) ||
      event.target.classList.contains(this.classNames.DELETE_IMAGE)
    );
  },
};

function generateUUID() {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
}

let todosData = JSON.parse(localStorage.getItem(DataKeys.TODOS)) || [];

function textNotEmpty(text) {
  return text.trim().length > 0;
}

function addTodo(text) {
  todosData.unshift({
    id: generateUUID(),
    text,
    completed: false,
  });
}

createTodoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newTodoText = newTodoTextInput.value;
  if (textNotEmpty(newTodoText)) {
    addTodo(newTodoText);
    renderTodos();
    updateItemsLeft();
    localStorage.setItem(DataKeys.TODOS, JSON.stringify(todosData));
  }
  createTodoForm.reset();
});

function createTodo(todoData) {
  let todo = document.createElement("div");
  todo.id = todoData.id;
  todo.classList.add(...ClassNames.todo.BASE);
  if (todoData.completed) {
    todo.classList.add(ClassNames.todo.COMPLETED);
  }
  todo.innerHTML = `
    <span class="${ClassNames.todo.CIRCLE}"></span>
    <span class="${ClassNames.todo.TEXT}">${todoData.text}</span>
    <span class="${ClassNames.todo.DELETE_BUTTON}">
      <img class="${ClassNames.todo.DELETE_IMAGE}" src="${Images.cross.path}" alt="${Images.cross.altText}"/>
    </span>
  `;
  todo.addEventListener("click", (event) => todoClickHandler(event, todo));
  return todo;
}

function displayTodos(todosData) {
  todosData.forEach((todoData) => {
    let newTodo = createTodo(todoData);
    todoContainer.append(newTodo);
  });
}

function updateFilterUI() {
  filters.forEach((filter) => {
    if (filter.innerText.toLowerCase() === selectedFilter) {
      filter.classList.add(ClassNames.filter.SELECTED);
    } else {
      filter.classList.remove(ClassNames.filter.SELECTED);
    }
  });
}

let selectedFilter = localStorage.getItem(DataKeys.FILTER) || Filters.ALL;

filters.forEach(function (filter) {
  filter.addEventListener("click", (event) => {
    let clickedFilter = event.target.innerText.toLowerCase();
    if (clickedFilter !== selectedFilter) {
      selectedFilter = clickedFilter;
      renderTodos();
      updateFilterUI();
      localStorage.setItem(DataKeys.FILTER, clickedFilter);
    }
  });
});

function determineTodosToDisplayBasedOnFilter(filter) {
  return filter === Filters.ACTIVE
    ? todosData.filter((todoData) => !todoData.completed)
    : filter === Filters.COMPLETED
    ? todosData.filter((todoData) => todoData.completed)
    : todosData;
}

function renderTodos() {
  todoContainer.innerHTML = "";
  let todosToDisplay = determineTodosToDisplayBasedOnFilter(selectedFilter);
  displayTodos(todosToDisplay);
}
function todoClickHandler(event, todo) {
  if (DeleteButton.clicked(event)) {
    todosData = todosData.filter((todoData) => todoData.id !== todo.id);
  } else {
    const clickedTodoData = todosData.find(
      (todoData) => todoData.id === todo.id
    );
    clickedTodoData.completed = !clickedTodoData.completed;
  }
  updateItemsLeft();
  renderTodos();
  localStorage.setItem(DataKeys.TODOS, JSON.stringify(todosData));
}

todos.forEach(function (todo) {
  todo.addEventListener("click", (event) => todoClickHandler(event, todo));
});

clearCompletedButton.addEventListener("click", (event) => {
  todosData = todosData.filter((todoData) => !todoData.completed);
  renderTodos();
  localStorage.setItem(DataKeys.TODOS, JSON.stringify(todosData));
});

function updateItemsLeft() {
  const itemsLeft = todosData.filter((todoData) => !todoData.completed).length;
  itemsLeftPlaceholder.innerText = itemsLeft;
}

updateItemsLeft();
renderTodos();
updateFilterUI();
