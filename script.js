const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");

const allFilter = document.getElementById("allFilter");
const activeFilter = document.getElementById("activeFilter");
const completedFilter = document.getElementById("completedFilter");
const clearCompleted = document.getElementById("clearCompleted");

const searchInput = document.getElementById("searchInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";
let searchText = "";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(task => task.completed);
    }

    if (searchText !== "") {
        filteredTasks = filteredTasks.filter(task =>
            task.text.toLowerCase().includes(searchText.toLowerCase())
        );
    }

    filteredTasks.forEach((task) => {
        const index = tasks.indexOf(task);

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const taskContent = document.createElement("div");

        const span = document.createElement("span");
        span.textContent = task.text;

        taskContent.appendChild(span);

        if (task.date) {
            const date = document.createElement("small");
            date.textContent = `Due: ${task.date}`;
            date.classList.add("task-date");

            taskContent.appendChild(date);
        }

        span.addEventListener("click", () => {
            tasks[index].completed = !tasks[index].completed;

            saveTasks();
            renderTasks();
        });

        const actions = document.createElement("div");
        actions.classList.add("actions");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit");

        editButton.addEventListener("click", () => {
            const newText = prompt("Edit your task:", task.text);

            if (newText === null) {
                return;
            }

            const updatedText = newText.trim();

            if (updatedText === "") {
                return;
            }

            tasks[index].text = updatedText;

            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete");

        deleteButton.addEventListener("click", () => {
            tasks.splice(index, 1);

            saveTasks();
            renderTasks();
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        li.appendChild(taskContent);
        li.appendChild(actions);

        taskList.appendChild(li);
    });

    const remainingTasks = tasks.filter(task => !task.completed).length;

    taskCounter.textContent =
        `${remainingTasks} ${remainingTasks === 1 ? "task" : "tasks"} remaining`;
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        return;
    }

    tasks.push({
        text: text,
        date: taskDate.value,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskDate.value = "";
    taskInput.focus();
}

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

allFilter.addEventListener("click", () => {
    currentFilter = "all";
    renderTasks();
});

activeFilter.addEventListener("click", () => {
    currentFilter = "active";
    renderTasks();
});

completedFilter.addEventListener("click", () => {
    currentFilter = "completed";
    renderTasks();
});

clearCompleted.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
});

searchInput.addEventListener("input", () => {
    searchText = searchInput.value.trim();

    renderTasks();
});

renderTasks();
