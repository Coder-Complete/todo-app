const todoContainer = document.querySelector(".todo-container");

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

function makeTodo(todoData) {
  let newTodo = document.createElement("div");
  newTodo.classList.add("bar", "todo");
  if (todoData.completed) newTodo.classList.add("bar", "completed");
  newTodo.innerHTML = `
    <span class="circle"></span>
    <span class="todo-text">${todoData.text}</span>
    <span class="delete-button">
      <img src="images/icon-cross.svg" alt=""/>
    </span>
  `;
  return newTodo;
}

function makeList() {
  todosData.forEach((todoData) => todoContainer.append(makeTodo(todoData)));
}

makeList();
