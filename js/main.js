// Знаходимо елементи на сторінці
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);

function addTask(event) {
  // відміна (стандартної поведінки) відправки форми
  event.preventDefault();

  // дістати текст з поля вводу
  const taskText = taskInput.value;

  // описуємо кожну задачу, як об'єкт
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // додаємо задачу в масив задач
  tasks.push(newTask);

  saveToLocalStorage();

  renderTask(newTask);

  // очистити поле вводу та повернути фокус
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  // перевірка якщо клік був НЕ по кнопці видалення задачі
  if (event.target.dataset.action !== "delete") return;

  // перевірка кліку по кнопці видалення
  const parentNode = event.target.closest(".list-group-item");

  // визначення id задачі
  const id = Number(parentNode.id);

  // видалення задачі через фільтрацію масиву
  tasks = tasks.filter((task) => task.id !== id);

  saveToLocalStorage();

  // видалення задачі з розмітки
  parentNode.remove();

  checkEmptyList();
}

function doneTask(event) {
  // перевірка якщо клік був НЕ по кнопці виконання задачі
  if (event.target.dataset.action !== "done") return;
  // перевірка кліку по кнопці виконано

  const parentNode = event.target.closest(".list-group-item");

  // визначення id задачі
  const id = Number(parentNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;

  saveToLocalStorage();

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Задачі відсутні</div></li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  // формуємо css клас
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  // формування розмітки для нової задачі
  const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

  // додаємо задачу на сторінку
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
