import {
  clearCompletedButton,
  createTodoForm,
  itemsLeftPlaceholder,
  newTodoTextInput,
  todoContainer,
  todos,
} from "../utils/domNodes";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
import { generateUUID, textNotEmpty } from "../utils/helpers";
import { deleteButton } from "../utils/deleteButton";
import { filterManager, FilterManager } from "../managers/filterManager";

class TodoManager {
  static DATA_KEY = "todos";
  static ClassNames = {
    BASE: ["bar", "todo"],
    COMPLETED: "completed",
    TEXT: "todo-text",
    CIRCLE: "circle",
  };

  constructor() {
    this.data = getLocalStorage(TodoManager.DATA_KEY) || [];
  }

  add = (text) => {
    this.data.unshift({
      id: generateUUID(),
      text: text,
      completed: false,
    });
    this.apply();
  };

  apply = () => {
    setLocalStorage(TodoManager.DATA_KEY, this.data);
    this.updateItemsLeft();
    this.renderTodos();
  };

  clearCompleted = () => {
    this.data = this.getActiveTodos();
    this.apply();
  };

  click = (event, todo) => {
    if (deleteButton.clicked(event)) {
      this.removeTodoByID(todo.id);
    } else {
      this.toggleTodoByID(todo.id);
    }
  };

  createTodo = (todoData) => {
    let newTodo = document.createElement("div");
    newTodo.id = todoData.id;
    newTodo.classList.add(...TodoManager.ClassNames.BASE);
    if (todoData.completed) {
      newTodo.classList.add(TodoManager.ClassNames.COMPLETED);
    }
    newTodo.innerHTML = `
      <span class="${TodoManager.ClassNames.CIRCLE}"></span>
      <span class="${TodoManager.ClassNames.TEXT}">${todoData.text}</span>
      <span class="${deleteButton.classNames.BUTTON}">
        <img class="${deleteButton.classNames.IMAGE}" src="${deleteButton.image.path}" alt="${deleteButton.image.altText}"/>
      </span>
    `;
    newTodo.addEventListener("click", (event) => this.click(event, newTodo));
    return newTodo;
  };

  findTodoByID = (todoID) =>
    this.data.find((todoData) => todoData.id === todoID);

  getActiveTodos = () => this.data.filter((item) => !item.completed);

  getCompletedTodos = () => this.data.filter((item) => item.completed);

  getTodoListBasedOnFilter = () =>
    filterManager.current === FilterManager.Filters.ACTIVE
      ? this.getActiveTodos()
      : filterManager.current === FilterManager.Filters.COMPLETED
      ? this.getCompletedTodos()
      : this.data;

  initialApply = () => {
    this.updateItemsLeft();
    this.renderTodos();
  };

  removeTodoByID = (todoID) => {
    this.data = this.data.filter((todoData) => todoData.id !== todoID);
    this.apply();
  };

  renderTodos = () => {
    todoContainer.innerHTML = "";
    let todosList = this.getTodoListBasedOnFilter();
    todosList.forEach((todoData) => {
      let newTodo = this.createTodo(todoData);
      todoContainer.append(newTodo);
    });
  };

  setupEventListeners = () => {
    createTodoForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const newTodoText = newTodoTextInput.value;
      if (textNotEmpty(newTodoText)) {
        this.add(newTodoText);
      }
      createTodoForm.reset();
    });

    todos.forEach((todo) =>
      todo.addEventListener("click", function (event) {
        this.click(event, todo);
      })
    );

    clearCompletedButton.addEventListener("click", (event) => {
      this.clearCompleted();
    });
  };

  toggleTodoByID = (todoID) => {
    const clickedTodoData = this.findTodoByID(todoID);
    clickedTodoData.completed = !clickedTodoData.completed;
    this.apply();
  };

  updateItemsLeft = () => {
    const itemsLeft = this.getActiveTodos().length;
    itemsLeftPlaceholder.innerText = itemsLeft;
  };
}

export const todoManager = new TodoManager();
