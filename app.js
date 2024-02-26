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

let todosData = [
  {
    id: generateUUID(),
    text: "Complete online javascript course",
    completed: true,
  },
  {
    id: generateUUID(),
    text: "Jog around the park 3x",
    completed: false,
  },
  {
    id: generateUUID(),
    text: "10 minutes meditation",
    completed: false,
  },
  {
    id: generateUUID(),
    text: "Read for 1 hour",
    completed: false,
  },
  {
    id: generateUUID(),
    text: "Pick up groceries",
    completed: false,
  },
  {
    id: generateUUID(),
    text: "Complete Todo App on Frontend Mentor",
    completed: false,
  },
];

function getThemeFromDatabase() {
  // contacts database asking for theme, and receives the theme
  const receivedTheme = "light-theme";
  return receivedTheme;
}

let currentTheme = getThemeFromDatabase();

if (currentTheme === "light-theme") {
  document.body.className = "light-theme";
} else {
  document.body.className = "dark-theme";
}

modeIcon.addEventListener("click", function (event) {
  if (theme === "light-theme") {
    theme = "dark-theme";
  } else {
    theme = "light-theme";
  }
  document.body.className = theme;
});

createTodoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const newTodoText = newTodoTextInput.value;
  if (newTodoText.trim().length > 0) {
    todosData.unshift({
      id: generateUUID(),
      text: newTodoText,
      completed: false,
    });
    renderTodos();
  }
  createTodoForm.reset();
});

function displayTodos(todosData) {
  todosData.forEach(function (todoData) {
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
    newTodo.addEventListener("click", function (event) {
      todoClickHandler(event, newTodo);
    });
    todoContainer.append(newTodo);
  });
}

function updateFilterUI() {
  filters.forEach(function (filter) {
    if (filter.innerText.toLowerCase() === selectedFilter) {
      filter.classList.add("selected");
    } else {
      filter.classList.remove("selected");
    }
  });
}

let selectedFilter = "all"; // 'all', 'active', 'completed'

filters.forEach(function (filter) {
  filter.addEventListener("click", function (event) {
    let clickedFilter = event.target.innerText.toLowerCase();
    if (clickedFilter !== selectedFilter) {
      selectedFilter = clickedFilter;
      renderTodos();
      updateFilterUI();
    }
  });
});

function renderTodos() {
  todoContainer.innerHTML = "";
  if (selectedFilter === "active") {
    let activeTodos = todosData.filter(function (todoData) {
      return !todoData.completed;
    });
    displayTodos(activeTodos);
  } else if (selectedFilter === "completed") {
    let completedTodos = todosData.filter(function (todoData) {
      return todoData.completed;
    });
    displayTodos(completedTodos);
  } else {
    displayTodos(todosData);
  }
}

function todoClickHandler(event, todo) {
  if (
    event.target.classList.contains("delete-button") ||
    event.target.classList.contains("delete-image")
  ) {
    todosData = todosData.filter(function (todoData) {
      return todoData.id !== todo.id;
    });
  } else {
    const clickedTodoData = todosData.find(function (todoData) {
      return todoData.id === todo.id;
    });
    clickedTodoData.completed = !clickedTodoData.completed;
  }
  updateItemsLeft();
  renderTodos();
}

todos.forEach(function (todo) {
  todo.addEventListener("click", function (event) {
    todoClickHandler(event, todo);
  });
});

clearCompletedButton.addEventListener("click", function (event) {
  todosData = todosData.filter(function (todoData) {
    return !todoData.completed;
  });
  renderTodos();
});

function updateItemsLeft() {
  const itemsLeft = todosData.filter(function (todoData) {
    return !todoData.completed;
  }).length;
  itemsLeftPlaceholder.innerText = itemsLeft;
}

updateItemsLeft();
renderTodos();
