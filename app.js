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

let todosData = JSON.parse(localStorage.getItem("todos")) || [];

function getThemeFromDatabase() {
  // contacts database asking for theme, and receives the theme
  return localStorage.getItem("theme") || "light-theme";
}

let currentTheme = getThemeFromDatabase();

document.body.className =
  currentTheme === "light-theme" ? "light-theme" : "dark-theme";

modeIcon.addEventListener("click", (event) => {
  currentTheme = currentTheme === "light-theme" ? "dark-theme" : "light-theme";
  document.body.className = currentTheme;
  localStorage.setItem("theme", currentTheme);
});

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
    localStorage.setItem("todos", JSON.stringify(todosData));
  }
  createTodoForm.reset();
});

function createTodo(todoData) {
  let todo = document.createElement("div");
  todo.id = todoData.id;
  todo.classList.add("bar", "todo");
  if (todoData.completed) {
    todo.classList.add("completed");
  }
  todo.innerHTML = `
    <span class="circle"></span>
    <span class="todo-text">${todoData.text}</span>
    <span class="delete-button">
      <img class="delete-image" src="images/icon-cross.svg" alt=""/>
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
      filter.classList.add("selected");
    } else {
      filter.classList.remove("selected");
    }
  });
}

let selectedFilter = localStorage.getItem("filter") || "all"; // 'all', 'active', 'completed'

filters.forEach(function (filter) {
  filter.addEventListener("click", (event) => {
    let clickedFilter = event.target.innerText.toLowerCase();
    if (clickedFilter !== selectedFilter) {
      selectedFilter = clickedFilter;
      renderTodos();
      updateFilterUI();
      localStorage.setItem("filter", clickedFilter);
    }
  });
});

function determineTodosToDisplayBasedOnFilter(filter) {
  return filter === "active"
    ? todosData.filter((todoData) => !todoData.completed)
    : filter === "completed"
    ? todosData.filter((todoData) => todoData.completed)
    : todosData;
}

function renderTodos() {
  todoContainer.innerHTML = "";
  let todosToDisplay = determineTodosToDisplayBasedOnFilter(selectedFilter);
  displayTodos(todosToDisplay);
}

function todoClickHandler(event, todo) {
  if (
    event.target.classList.contains("delete-button") ||
    event.target.classList.contains("delete-image")
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
  localStorage.setItem("todos", JSON.stringify(todosData));
}

todos.forEach(function (todo) {
  todo.addEventListener("click", (event) => todoClickHandler(event, todo));
});

clearCompletedButton.addEventListener("click", (event) => {
  todosData = todosData.filter((todoData) => !todoData.completed);
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todosData));
});

function updateItemsLeft() {
  const itemsLeft = todosData.filter((todoData) => !todoData.completed).length;
  itemsLeftPlaceholder.innerText = itemsLeft;
}

updateItemsLeft();
renderTodos();
updateFilterUI();
