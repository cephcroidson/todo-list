const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");
const themeToggle = document.getElementById("themeToggle");
const allFilter = document.getElementById("allFilter");
const activeFilter = document.getElementById("activeFilter");
const completedFilter = document.getElementById("completedFilter");
const clearCompleted = document.getElementById("clearCompleted");
const emptyState = document.getElementById("emptyState");
const emptyIcon = document.getElementById("emptyIcon");
const emptyTitle = document.getElementById("emptyTitle");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";
let searchText = "";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";
   emptyState.style.display = "none";
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
    if (filteredTasks.length === 0) {
    emptyState.style.display = "block";

    if (tasks.length === 0) {
        emptyIcon.textContent = "📋";
        emptyTitle.textContent = "No tasks yet";
        emptyMessage.textContent = "Add a task above to get started.";
    } else if (searchText !== "") {
        emptyIcon.textContent = "🔍";
        emptyTitle.textContent = "No tasks found";
        emptyMessage.textContent = "Try a different search term.";
    } else if (currentFilter === "active") {
        emptyIcon.textContent = "🎉";
        emptyTitle.textContent = "No active tasks";
        emptyMessage.textContent = "You've completed all your tasks!";
    } else if (currentFilter === "completed") {
        emptyIcon.textContent = "✅";
        emptyTitle.textContent = "No completed tasks";
        emptyMessage.textContent = "Completed tasks will appear here.";
    }
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
      const total = tasks.length;
const active = tasks.filter(task => !task.completed).length;
const completed = tasks.filter(task => task.completed).length;

totalTasks.textContent = total;
activeTasks.textContent = active;
completedTasks.textContent = completed;
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
function applyTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "☀️ Light Mode";
    } else {
        document.body.classList.remove("dark-mode");
        themeToggle.textContent = "🌙 Dark Mode";
    }
}

themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");

    if (isDark) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙 Dark Mode";
    }
});

applyTheme();
renderTasks();
