const todoContainer = document.querySelector(".todo-container");
const createTodoForm = document.querySelector(".create-todo-form");

let todosData = [
  {
    text: "Complete online JavaScript course",
    completed: true,
  },
  {
    text: "Job around the park 3x",
    completed: false,
  },
  {
    text: "10 minutes meditation",
    completed: false,
  },
  {
    text: "Read for 1 hour",
    completed: false,
  },
  {
    text: "Pick up groceries",
    completed: false,
  },
  {
    text: "Complete Todo App on Frontend Mentor",
    completed: false,
  },
];

function todoClickHandler(e, todoIndex) {
  todosData[todoIndex].completed = !todosData[todoIndex].completed;
  updateTodoList();
}

function makeTodo(todoData, todoIndex) {
  let todo = document.createElement("div");
  todo.classList.add("bar", "todo");
  if (todoData.completed) todo.classList.add("bar", "completed");
  todo.innerHTML = `
    <span class="circle"></span>
    <span class="todo-text">${todoData.text}</span>
    <span class="delete-button">
      <img src="images/icon-cross.svg" alt=""/>
    </span>
  `;
  todo.addEventListener("click", (e) => todoClickHandler(e, todoIndex));
  return todo;
}

function updateTodoList() {
  todoContainer.innerHTML = "";
  todosData.forEach((todoData, todoIndex) =>
    todoContainer.append(makeTodo(todoData, todoIndex))
  );
}

updateTodoList();

createTodoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = new FormData(e.target);
  let text = formData.get("new-todo-text");
  todosData.unshift({ text, completed: false });
  updateTodoList();
  createTodoForm.reset();
});
