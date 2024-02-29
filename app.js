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
};

const ClassNames = {
  todo: {
    BASE: ["bar", "todo"],
    COMPLETED: "completed",
    TEXT: "todo-text",
    CIRCLE: "circle",
  },
};

const DeleteButton = {
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

const Images = {
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

modeIcon.addEventListener("click", (event) => {
  themeManager.toggle();
});

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
    this.updateUI();
    renderTodos();
  };

  getFilterNameFromDomNode = (node) => {
    return node.innerText.toLowerCase();
  };

  switch = (event) => {
    let clickedFilter = this.getFilterNameFromDomNode(event.target);
    if (clickedFilter !== this.current) {
      this.current = clickedFilter;
      this.apply();
    }
  };

  updateUI = () => {
    filters.forEach((filter) => {
      if (this.getFilterNameFromDomNode(filter) === this.current) {
        filter.classList.add(FilterManager.ClassNames.SELECTED);
      } else {
        filter.classList.remove(FilterManager.ClassNames.SELECTED);
      }
    });
  };
}

filters.forEach(function (filter) {
  filter.addEventListener("click", (event) => {
    filterManager.switch(event);
  });
});

function renderTodos() {
  todoContainer.innerHTML = "";
  let todosList = todosData.filter((todoData) =>
    filterManager.current === FilterManager.Filters.ACTIVE
      ? !todoData.completed
      : filterManager.current === FilterManager.Filters.COMPLETED
      ? todoData.completed
      : true
  );
  displayTodos(todosList);
}

function generateUUID() {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
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

function addNewTodoData(text) {
  todosData.unshift({
    id: generateUUID(),
    text: text,
    completed: false,
  });
  renderTodos();
  updateItemsLeft();
  setLocalStorage(DataKeys.TODOS, todosData);
}

function todoTextNotEmpty(text) {
  return text.trim().length > 0;
}

createTodoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newTodoText = newTodoTextInput.value;
  if (todoTextNotEmpty(newTodoText)) {
    addNewTodoData(newTodoText);
  }
  createTodoForm.reset();
});

function createTodo(todoData) {
  let newTodo = document.createElement("div");
  newTodo.id = todoData.id;
  newTodo.classList.add(...ClassNames.todo.BASE);
  if (todoData.completed) {
    newTodo.classList.add(ClassNames.todo.COMPLETED);
  }
  newTodo.innerHTML = `
    <span class="${ClassNames.todo.CIRCLE}"></span>
    <span class="${ClassNames.todo.TEXT}">${todoData.text}</span>
    <span class="${DeleteButton.classNames.BUTTON}">
      <img class="${DeleteButton.classNames.IMAGE}" src="${Images.cross.path}" alt="${Images.cross.altText}"/>
    </span>
  `;
  newTodo.addEventListener("click", (event) =>
    todoClickHandler(event, newTodo)
  );
  return newTodo;
}

function displayTodos(todosData) {
  todosData.forEach((todoData) => {
    let newTodo = createTodo(todoData);
    todoContainer.append(newTodo);
  });
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
  setLocalStorage(DataKeys.TODOS, todosData);
}

todos.forEach((todo) =>
  todo.addEventListener("click", function (event) {
    todoClickHandler(event, todo);
  })
);

clearCompletedButton.addEventListener("click", (event) => {
  todosData = todosData.filter((todoData) => !todoData.completed);
  renderTodos();
  setLocalStorage(DataKeys.TODOS, todosData);
});

function updateItemsLeft() {
  const itemsLeft = todosData.filter((todoData) => !todoData.completed).length;
  itemsLeftPlaceholder.innerText = itemsLeft;
}

let todosData = getLocalStorage(DataKeys.TODOS) || [];
let themeManager = new ThemeManager();
themeManager.apply();
let filterManager = new FilterManager();
filterManager.apply();
updateItemsLeft();
// renderTodos();
