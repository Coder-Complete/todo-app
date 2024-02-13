const modeIcon = document.querySelector(".mode-icon");
const createTodoForm = document.querySelector("#create-todo-form");
const newTodoTextInput = document.querySelector("#new-todo-input");
const todoContainer = document.querySelector(".todo-container");
const todos = document.querySelectorAll(".todo");
const deleteButtons = document.querySelectorAll(".delete-button");
const clearCompletedButton = document.querySelector(".clear-completed-button");
const itemsLeftPlaceholder = document.querySelector(".items-left");
const filters = document.querySelectorAll(".filter");

modeIcon.addEventListener("click", function (event) {
  if (document.body.className === "light-theme") {
    document.body.className = "dark-theme";
  } else {
    document.body.className = "light-theme";
  }
});

function todoClickHandler(event, todo) {
  todo.classList.toggle("completed");
  updateItemsLeft();
}

createTodoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const newTodoText = newTodoTextInput.value;
  if (newTodoText.trim().length > 0) {
    const newTodo = document.createElement("div");
    newTodo.className = "bar todo";
    newTodo.innerHTML = `
    <span class="circle"></span>
    <span class="todo-text">${newTodoText}</span>
    <span class="delete-button">
      <img src="images/icon-cross.svg" alt=""/>
    </span>
  `;
    newTodo.addEventListener("click", function (event) {
      todoClickHandler(event, newTodo);
    });

    todoContainer.prepend(newTodo);
  }
  createTodoForm.reset();
});

function updateItemsLeft() {
  let currentTodos = Array.from(document.querySelectorAll(".todo"));
  let todosNotCompleted = currentTodos.filter(function (todo) {
    return !todo.classList.contains("completed");
  });
  itemsLeftPlaceholder.innerText = todosNotCompleted.length;
}

todos.forEach(function (todo) {
  todo.addEventListener("click", function (event) {
    todoClickHandler(event, todo);
  });
});

deleteButtons.forEach(function (deleteButton) {
  deleteButton.addEventListener("click", function (event) {
    deleteButton.parentNode.remove();
    updateItemsLeft();
    event.stopPropagation(); // prevent todo click event listener
  });
});

clearCompletedButton.addEventListener("click", function (event) {
  const completedTodos = document.querySelectorAll(".todo.completed");
  completedTodos.forEach(function (completedTodo) {
    completedTodo.remove();
  });
});

function clickedFilterIsAlreadySelected(clickedFilter) {
  let currentlySelectedFilter = document
    .querySelector(".selected")
    .innerText.toLowerCase();
  return clickedFilter === currentlySelectedFilter;
}

function determineClickedFilter(event) {
  return event.target.innerText.toLowerCase();
}

function changeTodoListBasedOnFilter(clickedFilter) {
  let currentTodos = document.querySelectorAll(".todo");
  currentTodos.forEach(function (todo) {
    let todoIsCompleted = todo.classList.contains("completed");
    if (clickedFilter === "completed" && todoIsCompleted) {
      todo.style.display = "flex";
    } else if (clickedFilter === "completed" && !todoIsCompleted) {
      todo.style.display = "none";
    } else if (clickedFilter === "active" && todoIsCompleted) {
      todo.style.display = "none";
    } else if (clickedFilter === "active" && !todoIsCompleted) {
      todo.style.display = "flex";
    } else {
      todo.style.display = "flex";
    }
  });
}

function changeFilterUI(clickedFilter) {
  filters.forEach(function (filterItem) {
    if (filterItem.innerText.toLowerCase() === clickedFilter) {
      filterItem.classList.add("selected");
    } else {
      filterItem.classList.remove("selected");
    }
  });
}

filters.forEach(function (filter) {
  filter.addEventListener("click", function (event) {
    let clickedFilter = determineClickedFilter(event);
    if (!clickedFilterIsAlreadySelected(clickedFilter)) {
      changeTodoListBasedOnFilter(clickedFilter);
      changeFilterUI(clickedFilter);
    }
  });
});

updateItemsLeft();
