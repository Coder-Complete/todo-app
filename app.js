const createTodoForm = document.querySelector(".create-todo");
const todoContainer = document.querySelector(".todo-container");
const deleteButtons = document.querySelectorAll(".delete-button");
const clearCompletedButton = document.querySelector(".clear-completed-button");
const itemsLeftPlaceholder = document.querySelector(".items-left");

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

function updateItemsLeft() {
  let itemsLeft = getItemsLeft();
  itemsLeftPlaceholder.innerText = getItemsLeft().toString();
}

updateItemsLeft();

function todoClickHandler(event, todo) {
  if (
    event.target.classList.contains("delete-button") ||
    event.target.classList.contains("delete-image")
  ) {
    todo.remove();
  } else {
    todo.classList.toggle("completed");
  }
  updateItemsLeft();
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
  return newTodoElement;
}

function validateText(text) {
  return text.length > 0;
}

createTodoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = new FormData(e.target);
  let text = data.get("new-todo-text");
  if (validateText(text)) {
    todoContainer.append(createNewTodoElement(text));
  }
  createTodoForm.reset();
  updateItemsLeft();
});

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
