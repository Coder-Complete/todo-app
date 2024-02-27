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

let todosData = getLocalStorage("todos") || [];
let theme = getLocalStorage("theme") || "light-theme";
let selectedFilter = getLocalStorage("filter") || "all"; // 'all', 'active', 'completed'

document.body.className = theme;

modeIcon.addEventListener("click", (event) => {
  theme === "light-theme" ? "dark-theme" : "light-theme";
  document.body.className = theme;
  setLocalStorage("theme", theme);
});

createTodoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newTodoText = newTodoTextInput.value;
  if (newTodoText.trim().length > 0) {
    todosData.unshift({
      id: generateUUID(),
      text: newTodoText,
      completed: false,
    });
    renderTodos();
    updateItemsLeft();
    setLocalStorage("todos", todosData);
  }
  createTodoForm.reset();
});

function displayTodos(todosData) {
  todosData.forEach((todoData) => {
    let newTodo = document.createElement("div");
    newTodo.id = todoData.id;
    newTodo.classList.add("bar", "todo");
    if (todoData.completed) {
      newTodo.classList.add("completed");
    }
    newTodo.innerHTML = `
      <span class="circle"></span>
      <span class="todo-text">${todoData.text}</span>
      <span class="delete-button">
        <img class="delete-image" src="images/icon-cross.svg" alt=""/>
      </span>
    `;
    newTodo.addEventListener("click", (event) =>
      todoClickHandler(event, newTodo)
    );
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

filters.forEach(function (filter) {
  filter.addEventListener("click", (event) => {
    let clickedFilter = event.target.innerText.toLowerCase();
    if (clickedFilter !== selectedFilter) {
      selectedFilter = clickedFilter;
      renderTodos();
      updateFilterUI();
      setLocalStorage("filter", clickedFilter);
    }
  });
});

function renderTodos() {
  todoContainer.innerHTML = "";
  let todosList = todosData.filter((todoData) =>
    selectedFilter === "active"
      ? !todoData.completed
      : selectedFilter === "completed"
      ? todoData.completed
      : true
  );
  displayTodos(todosList);
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
  setLocalStorage("todos", todosData);
}

todos.forEach((todo) =>
  todo.addEventListener("click", function (event) {
    todoClickHandler(event, todo);
  })
);

clearCompletedButton.addEventListener("click", (event) => {
  todosData = todosData.filter((todoData) => !todoData.completed);
  renderTodos();
  setLocalStorage("todos", todosData);
});

function updateItemsLeft() {
  const itemsLeft = todosData.filter((todoData) => !todoData.completed).length;
  itemsLeftPlaceholder.innerText = itemsLeft;
}

updateItemsLeft();
updateFilterUI();
renderTodos();
