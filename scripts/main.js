const input = document.querySelector("#task-input");
const totalTasks = document.querySelector("#total");
const completedTasks = document.querySelector("#completed");
const modal = document.querySelector("#modal");
const maxRecentlyDeleted = 4;

totalTasks.innerHTML = loadData("totalTasks") || saveData("totalTasks", 0)
completedTasks.innerHTML = loadData("completedTasks") || saveData("completedTasks", 0)

const deleteTaskOnClick = (element) => {
    const id = Number(element.dataset.id);
    readOneTask(taskStore, id, task => {
        const completedTask = new CompletedTask(task.title);
        addTask(completedTaskStore, completedTask, () => {
            element.classList.add("exit");
            element.addEventListener("animationend", () => {
                deleteTask(taskStore, id, () => {
                    totalTasks.innerHTML = decrementData("totalTasks");
                    completedTasks.innerHTML = incrementData("completedTasks");
                    updateTasks();
                });
            });
        });
    });
}

const updateTasks = () => {
    readTask(taskStore, (tasks) => {
        let list = document.querySelector("#task-list");
        list.innerHTML = String();
        tasks.forEach(task => {
            let li = document.createElement("li");
            li.innerHTML = task.title;
            li.setAttribute("data-id", task.id);
            li.addEventListener("click", () => { deleteTaskOnClick(li); });
            list.appendChild(li);
        });
    });
    readTask(completedTaskStore, (tasks) => {
        let list = document.querySelector("#completed-task-list");
        list.innerHTML = String();
        tasks.reverse().slice(0, maxRecentlyDeleted).forEach(task => {
            let li = document.createElement("li");
            li.innerHTML = `${task.title}: <span>${task.date}</span>`;
            li.className = "invert";
            list.appendChild(li);
        });
    });
}

const updateTheme = (theme = loadData("toDoTheme")) => {
    const isLight = theme === "light";
    const root = document.documentElement;
    root.style.setProperty("--bg-color", isLight ? "255, 255, 255" : "19, 19, 19");
    root.style.setProperty("--text-color", isLight ? "12, 12, 12" : "255, 255, 255");
    root.style.setProperty("--shadow-color", isLight ? "0, 0, 0" : "255, 255, 255");
    root.style.setProperty("--gradient-1", isLight ? "108, 109, 103" : "34, 208, 163");
    root.style.setProperty("--gradient-2", isLight ? "100, 25, 148" : "32, 173, 211");
    root.style.setProperty("--sidebar-gradient-1", isLight ? "255, 255, 255" : "35, 35, 35");
    root.style.setProperty("--sidebar-gradient-2", isLight ? "251, 247, 247" : "46, 46, 46");
    document.querySelector(".current-theme").classList.remove("current-theme");
    document.querySelector(`#${theme}`).classList.add("current-theme")
    saveData("toDoTheme", theme);
    const invert = isLight ? "0%" : "100%";
    document.querySelectorAll(".icon").forEach(icon => {
        icon.style.filter = `brightness(100%) invert(${invert})`;
    })
}

const attemptReset = () => { modal.showModal(); }

const closeModal = () => { modal.close(); }

const reset = () => {
    totalTasks.innerHTML = saveData("totalTasks", 0);
    completedTasks.innerHTML = saveData("completedTasks", 0);
    deleteAllTask(taskStore);
    deleteAllTask(completedTaskStore);
    updateTasks();
}

input.addEventListener("keydown", ($event) => {
    if ($event.key === "Enter") {
        let task = new Task(input.value);
        input.value = String();
        if (task.title) {
            addTask(taskStore, task, () => {
                totalTasks.innerHTML = incrementData("totalTasks");
                updateTasks();
            });
        }
    }
})

document.querySelectorAll(".themes").forEach(theme => {
    theme.addEventListener("click", () => updateTheme(theme.dataset.theme));
});

document.querySelector("#reset").addEventListener("click", attemptReset);

document.querySelectorAll(".modal-button").forEach(button => {
    button.addEventListener("click", closeModal);
    button.dataset.confirm && button.addEventListener("click", reset);
});

const onLoad = () => {
    updateTasks();
    updateTheme("light");
    document.body.style.display = "flex";
}