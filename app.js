const modeIcon = document.querySelector(".mode-icon");
const createTodoForm = document.querySelector("#create-todo-form");
const newTodoTextInput = document.querySelector("#new-todo-input");
const todoContainer = document.querySelector(".todo-container");
const todos = document.querySelectorAll(".todo");
const deleteButtons = document.querySelectorAll(".delete-button");
const clearCompletedButton = document.querySelector(".clear-completed-button");
const itemsLeftPlaceholder = document.querySelector(".items-left");
const filters = document.querySelectorAll(".filter");

const Themes = {
  LIGHT: "light-theme",
  DARK: "dark-theme",
};

const Filters = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
};

const DataKeys = {
  SELECTED_FILTER: "filter",
  SELECTED_THEME: "theme",
  TODOS: "todos",
};

const ClassNames = {
  filter: {
    SELECTED: "selected",
  },
  deleteButton: {
    BUTTON: "delete-button",
    IMAGE: "delete-image",
  },
  todo: {
    BASE: ["bar", "todo"],
    COMPLETED: "completed",
    TEXT: "todo-text",
    CIRCLE: "circle",
  },
};

const Images = {
  cross: { path: "images/icon-cross.svg", altText: "" },
};

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

let todosData = getLocalStorage(DataKeys.todos) || [];
let theme = getLocalStorage(DataKeys.SELECTED_THEME) || Themes.LIGHT;
let selectedFilter = getLocalStorage(DataKeys.SELECTED_FILTER) || Filters.ALL;

document.body.className = theme;

modeIcon.addEventListener("click", (event) => {
  theme === Themes.LIGHT ? Themes.DARK : Themes.LIGHT;
  document.body.className = theme;
  setLocalStorage(DataKeys.SELECTED_THEME, theme);
});

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
  return newTodoText.trim().length > 0;
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
  newTodo.classList.add(ClassNames.todo.BASE);
  if (todoData.completed) {
    newTodo.classList.add(ClassNames.todo.COMPLETED);
  }
  newTodo.innerHTML = `
    <span class="${ClassNames.todo.CIRCLE}"></span>
    <span class="${ClassNames.todo.TEXT}">${todoData.text}</span>
    <span class="${ClassNames.deleteButton.BUTTON}">
      <img class="${ClassNames.deleteButton.IMAGE}" src="${Images.cross.path}" alt="${Images.cross.altText}"/>
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

function updateFilterUI() {
  filters.forEach((filter) => {
    if (filter.innerText.toLowerCase() === selectedFilter) {
      filter.classList.add(ClassNames.filter.SELECTED);
    } else {
      filter.classList.remove(ClassNames.filter.SELECTED);
    }
  });
}

filters.forEach(function (filter) {
  filter.addEventListener("click", (event) => {
    let clickedFilter = event.target.innerText.toLowerCase();
    if (clickedFilter !== selectedFilter) {
      selectedFilter = clickedFilter;
      renderTodos();
      updateFilterUI();
      setLocalStorage(DataKeys.SELECTED_FILTER, clickedFilter);
    }
  });
});

function renderTodos() {
  todoContainer.innerHTML = "";
  let todosList = todosData.filter((todoData) =>
    selectedFilter === Filters.ACTIVE
      ? !todoData.completed
      : selectedFilter === Filters.COMPLETED
      ? todoData.completed
      : true
  );
  displayTodos(todosList);
}

function todoClickHandler(event, todo) {
  if (
    event.target.classList.contains(ClassNames.deleteButton.BUTTON) ||
    event.target.classList.contains(ClassNames.deleteButton.IMAGE)
  ) {
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

updateItemsLeft();
updateFilterUI();
renderTodos();
