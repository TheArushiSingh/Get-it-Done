let database;

const taskStore = "Tasks";
const completedTaskStore = "CompletedTasks";

let defaultError = () => { console.log("Something went wrong.") }

class Task { constructor(title) { this.title = title; } }

class CompletedTask extends Task {
    constructor(title) {
        super(title);
        this.date = getCurrentDate();
    }
}

window.onload = () => {
    let req = window.indexedDB.open("GetItDoneAppDB", 1);
    req.onsuccess = () => {
        database = req.result;
        onLoad();
    }
    req.onerror = $event => { alert("There was an error.", $event); }
    req.onupgradeneeded = $event => {
        database = req.result;
        let taskObjectStore = database.createObjectStore(taskStore,  {keyPath: "id", autoIncrement: true});
        let completedTaskObjectStore = database.createObjectStore(completedTaskStore,  {keyPath: "id", autoIncrement: true});
    }
}

const addTask = (store, task, success, error = defaultError) => {
    let transaction = database.transaction([store], "readwrite");
    let objectStore = transaction.objectStore(store);
    let request = objectStore.add(task);
    request.onerror = error;
    request.onsuccess = success;
}

const readTask = (store, success, error = defaultError) => {
    let transaction = database.transaction([store], "readonly");
    let objectStore = transaction.objectStore(store);
    let request = objectStore.openCursor();
    let tasks = []
    request.onerror = error;
    request.onsuccess = $event => {
        let cursor = $event.target.result;
        if (cursor) {
            tasks.push(cursor.value);
            cursor.continue();
        } else { success(tasks); }
    }
}

const readOneTask = (store, id, success, error = defaultError) => {
    let transaction = database.transaction([store], "readonly");
    let objectStore = transaction.objectStore(store);
    let request = objectStore.get(id);
    request.onerror = error;
    request.onsuccess = () => { success(request.result); }
}

const deleteTask = (store, id, success, error = defaultError) => {
    let transaction = database.transaction([store], "readwrite");
    let objectStore = transaction.objectStore(store);
    let request = objectStore.delete(id);
    request.onerror = error;
    request.onsuccess = success;
}

const deleteAllTask = (store, success, error = defaultError) => {
    success = success || function() {};
    let transaction = database.transaction([store], "readwrite");
    let objectStore = transaction.objectStore(store);
    let request = objectStore.clear();
    request.onerror = error;
    request.onsuccess = success;
}




