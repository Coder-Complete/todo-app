const createTodoForm = document.querySelector(".create-todo");
const todoContainer = document.querySelector(".todo-container");
const todos = document.querySelectorAll(".todo");
const deleteButtons = document.querySelectorAll(".delete-button");

function newTodo(todoText) {
  let newTodoElement = document.createElement("div");
  newTodoElement.className = "bar todo";
  newTodoElement.innerHTML = `
      <span class="circle"></span>
      <span class="todo-text">${todoText}</span>
      <span class="delete-button"
        ><img src="images/icon-cross.svg" alt=""/>
      </span>
  `;
  newTodoElement.addEventListener("click", (e) => {
    newTodoElement.classList.toggle("completed");
  });
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
    todoContainer.append(newTodo(text));
  }
  createTodoForm.reset();
});

todos.forEach((todo) => {
  todo.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("delete-button") ||
      e.target.classList.contains("delete-image")
    ) {
      todo.remove();
    } else {
      todo.classList.toggle("completed");
    }
  });
});
