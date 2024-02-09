const createTodoForm = document.querySelector(".create-todo");
const todoContainer = document.querySelector(".todo-container");
const deleteButtons = document.querySelectorAll(".delete-button");
const clearCompletedButton = document.querySelector(".clear-completed-button");
const itemsLeftPlaceholder = document.querySelector(".items-left");
const filters = document.querySelectorAll(".filter");
const modeIcon = document.querySelector(".mode-icon");

function getCurrentlySelectedFilter() {
  return document.querySelector(".filter.selected");
}

function updateListBasedOnFilter(filter) {
  if (filter.innerText === "All") {
    getTodos().forEach((todo) => {
      todo.style.display = "flex";
    });
  } else if (filter.innerText === "Active") {
    getTodos().forEach((todo) => {
      if (todo.classList.contains("completed")) {
        todo.style.display = "none";
      } else {
        todo.style.display = "flex";
      }
    });
  } else {
    getTodos().forEach((todo) => {
      if (todo.classList.contains("completed")) {
        todo.style.display = "flex";
      } else {
        todo.style.display = "none";
      }
    });
  }
  updateSelectedFilterUI(filter);
}

function getTodos() {
  return document.querySelectorAll(".todo");
}

function getItemsLeft() {
  let itemsLeft = 0;
  getTodos().forEach((todo) => {
    if (!todo.classList.contains("completed")) {
      itemsLeft++;
    }
  });
  return itemsLeft;
}

function updateItemsLeftText() {
  itemsLeftPlaceholder.innerText = getItemsLeft().toString();
}

updateItemsLeftText();

function todoClickHandler(event, todo) {
  if (
    event.target.classList.contains("delete-button") ||
    event.target.classList.contains("delete-image")
  ) {
    todo.remove();
  } else {
    todo.classList.toggle("completed");
  }
  updateItemsLeftText();
  updateListBasedOnFilter(getCurrentlySelectedFilter());
}

function createNewTodoElement(todoText) {
  let newTodoElement = document.createElement("div");
  newTodoElement.className = "bar todo";
  newTodoElement.innerHTML = `
      <span class="circle"></span>
      <span class="todo-text">${todoText}</span>
      <span class="delete-button"
        ><img class="delete-image" src="images/icon-cross.svg" alt=""/>
      </span>
  `;
  newTodoElement.addEventListener("click", (e) =>
    todoClickHandler(e, newTodoElement)
  );
  todoContainer.prepend(newTodoElement);
}

function validateText(text) {
  return text.length > 0;
}

function createTodo(e) {
  e.preventDefault();
  let data = new FormData(e.target);
  let text = data.get("new-todo-text");
  if (validateText(text)) {
    createNewTodoElement(text);
  }
  createTodoForm.reset();
  updateItemsLeftText();
  updateListBasedOnFilter(getCurrentlySelectedFilter());
}

createTodoForm.addEventListener("submit", createTodo);

let todos = getTodos();
todos.forEach((todo) => {
  todo.addEventListener("click", (e) => todoClickHandler(e, todo));
});

clearCompletedButton.addEventListener("click", (e) => {
  getTodos().forEach((todo) => {
    if (todo.classList.contains("completed")) {
      todo.remove();
    }
  });
});

function updateSelectedFilterUI(clickedFilter) {
  filters.forEach((filter) => {
    if (filter.innerText === clickedFilter.innerText) {
      filter.classList.add("selected");
    } else {
      filter.classList.remove("selected");
    }
  });
}

function filterIsSelected(filter) {
  return filter.classList.contains("selected");
}

function filterClickHandler(e) {
  const clickedFilter = e.target;
  if (!filterIsSelected(clickedFilter)) {
    updateListBasedOnFilter(clickedFilter);
  }
}

filters.forEach((filter) => {
  filter.addEventListener("click", filterClickHandler);
});

function changeMode(e) {
  document.body.classList = document.body.classList.contains("light-theme")
    ? "dark-theme"
    : "light-theme";
}

modeIcon.addEventListener("click", changeMode);
