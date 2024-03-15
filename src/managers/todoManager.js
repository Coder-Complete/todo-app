import {
  createTodoForm,
  newTodoTextInput,
  todoContainer,
  todos,
  clearCompletedButton,
  itemsLeftPlaceholder,
} from "../utils/domElements";
import { generateUUID, textNotEmpty } from "../utils/helpers";
import { DeleteButton } from "../utils/deleteButton";
import filterManager, { FilterManager } from "./filterManager";

class TodoManager {
  static ClassNames = {
    BASE: ["bar", "todo"],
    COMPLETED: "completed",
    CIRCLE: "circle",
    DELETE_BUTTON: "delete-button",
    DELETE_IMAGE: "delete-image",
    TEXT: "todo-text",
  };
  static DATA_KEY = "todos";

  constructor(filterManager) {
    this.data = this.getTodosFromDatabase();
    this.filterManager = filterManager;
    this.filterManager.setRenderTodos(this.renderTodos);
  }

  addTodo(text) {
    this.data.unshift({
      id: generateUUID(),
      text,
      completed: false,
    });
    this.applyChanges();
  }

  applyChanges() {
    localStorage.setItem(TodoManager.DATA_KEY, JSON.stringify(this.data));
    this.renderTodos();
    this.updateItemsLeft();
  }

  createTodo(todoData) {
    let todo = document.createElement("div");
    todo.id = todoData.id;
    todo.classList.add(...TodoManager.ClassNames.BASE);
    if (todoData.completed) {
      todo.classList.add(TodoManager.ClassNames.COMPLETED);
    }
    todo.innerHTML = `
      <span class="${TodoManager.ClassNames.CIRCLE}"></span>
      <span class="${TodoManager.ClassNames.TEXT}">${todoData.text}</span>
      <span class="${TodoManager.ClassNames.DELETE_BUTTON}">
        <img class="${TodoManager.ClassNames.DELETE_IMAGE}" src="${DeleteButton.image.path}" alt="${DeleteButton.image.altText}"/>
      </span>
    `;
    todo.addEventListener("click", (event) =>
      this.todoClickHandler(event, todo)
    );
    return todo;
  }

  determineTodosToDisplayBasedOnFilter(filter) {
    return filter === FilterManager.Filters.ACTIVE
      ? this.getActiveTodos()
      : filter === FilterManager.Filters.COMPLETED
      ? this.getCompletedTodos()
      : this.data;
  }

  displayTodos(todosData) {
    todosData.forEach((todoData) => {
      let newTodo = this.createTodo(todoData);
      todoContainer.append(newTodo);
    });
  }

  getActiveTodos() {
    return this.data.filter((todoData) => !todoData.completed);
  }

  getCompletedTodos() {
    return this.data.filter((todoData) => todoData.completed);
  }

  getTodosFromDatabase() {
    return JSON.parse(localStorage.getItem(TodoManager.DATA_KEY)) || [];
  }

  initialize() {
    this.setupEventListeners();
    this.updateItemsLeft();
    this.renderTodos();
  }

  renderTodos() {
    todoContainer.innerHTML = "";
    console.log(this.filterManager);
    let todosToDisplay = this.determineTodosToDisplayBasedOnFilter(
      this.filterManager.current
    );
    this.displayTodos(todosToDisplay);
  }

  setupEventListeners() {
    clearCompletedButton.addEventListener("click", (event) => {
      this.data = this.getActiveTodos();
      this.applyChanges();
    });
    createTodoForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const newTodoText = newTodoTextInput.value;
      if (textNotEmpty(newTodoText)) {
        this.addTodo(newTodoText);
      }
      createTodoForm.reset();
    });
    todos.forEach(function (todo) {
      todo.addEventListener("click", (event) =>
        this.todoClickHandler(event, todo)
      );
    });
  }

  todoClickHandler(event, todo) {
    if (DeleteButton.clicked(event)) {
      this.data = this.data.filter((todoData) => todoData.id !== todo.id);
    } else {
      const clickedTodoData = this.data.find(
        (todoData) => todoData.id === todo.id
      );
      clickedTodoData.completed = !clickedTodoData.completed;
    }
    this.applyChanges();
  }

  updateItemsLeft() {
    const itemsLeft = this.getActiveTodos().length;
    itemsLeftPlaceholder.innerText = itemsLeft;
  }
}

export default new TodoManager(filterManager);
