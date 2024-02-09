const createTodoForm = document.querySelector(".create-todo");
const todoContainer = document.querySelector(".todo-container");

function newTodo(todoText) {
  return `<div class="bar todo">
      <span class="circle"></span>
      <span class="todo-text">${todoText}</span>
      <span class="delete-button"
        ><img src="images/icon-cross.svg" alt=""
      /></span>
    </div>`;
}

function validateText(text) {
  return text.length > 0;
}

createTodoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = new FormData(e.target);
  let text = data.get("new-todo-text");
  if (validateText(text)) {
    todoContainer.innerHTML += newTodo(text);
  }
  createTodoForm.reset();
});
