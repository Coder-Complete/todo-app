const todoContainer = document.querySelector(".todo-container");
const createTodoForm = document.querySelector(".create-todo-form");
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
    text: "Complete online JavaScript course",
    completed: true,
  },
  {
    id: generateUUID(),
    text: "Job around the park 3x",
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

function todoClickHandler(e, todo) {
  if (
    e.target.classList.contains("delete-button") ||
    e.target.classList.contains("delete-image")
  ) {
    todosData = todosData.filter((todoData) => todoData.id !== todo.id);
  } else {
    todosData = todosData.map((todoData) => {
      if (todoData.id === todo.id) {
        todoData.completed = !todoData.completed;
      }
      return todoData;
    });
  }
  updateUIWithNewList();
}

function makeTodo(todoData) {
  let todo = document.createElement("div");
  todo.id = todoData.id;
  todo.classList.add("bar", "todo");
  if (todoData.completed) todo.classList.add("bar", "completed");
  todo.innerHTML = `
    <span class="circle"></span>
    <span class="todo-text">${todoData.text}</span>
    <span class="delete-button">
      <img class="delete-image" src="images/icon-cross.svg" alt=""/>
    </span>
  `;
  todo.addEventListener("click", (e) => todoClickHandler(e, todo));
  return todo;
}

function getCurrentFilter() {
  return document.querySelector(".filter.selected").innerText.toLowerCase();
}

function updateUIWithNewList() {
  // populate todo list
  todoContainer.innerHTML = "";
  const currentFilter = getCurrentFilter();
  let todosDataToDisplay = todosData.filter((todoData) => {
    if (currentFilter === "active") return !todoData.completed;
    if (currentFilter === "completed") return todoData.completed;
    return true; // No filter applied
  });
  todosDataToDisplay.forEach((todoData) =>
    todoContainer.append(makeTodo(todoData))
  );
  // populate "items left" count
  itemsLeftPlaceholder.innerText = todosData.filter(
    (todoData) => !todoData.completed
  ).length;
}

updateUIWithNewList();

createTodoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = new FormData(e.target);
  let text = formData.get("new-todo-text");
  todosData.unshift({
    id: generateUUID(),
    text,
    completed: false,
  });
  updateUIWithNewList();
  createTodoForm.reset();
});

clearCompletedButton.addEventListener("click", (e) => {
  todosData = todosData.filter((todoData) => !todoData.completed);
  updateUIWithNewList();
});

function updateFilter(clickedFilter) {
  filters.forEach((filter) => {
    if (filter.innerText === clickedFilter.innerText) {
      filter.classList.add("selected");
    } else {
      filter.classList.remove("selected");
    }
  });
}

function filterAlreadySelected(clickedFilter) {
  return clickedFilter.classList.contains("selected");
}

filters.forEach((filter) =>
  filter.addEventListener("click", (e) => {
    const clickedFilter = e.target;
    if (!filterAlreadySelected(clickedFilter)) {
      updateFilter(clickedFilter);
      updateUIWithNewList();
    }
  })
);
